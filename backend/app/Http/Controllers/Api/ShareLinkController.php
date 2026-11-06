<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShareLinkController extends Controller
{
    /**
     * Show shared attendance report
     * Supports both Lesson / Day session report and Full Course report
     * GET /api/share/{token}
     */
    public function show($token)
    {
        $link = DB::table('share_links')
            ->join('courses', 'share_links.course_id', '=', 'courses.id')
            ->leftJoin('teaching_sessions', 'share_links.session_id', '=', 'teaching_sessions.id')
            ->where('share_links.token', $token)
            ->where('share_links.is_revoked', false)
            ->select(
                'share_links.*',
                'courses.code as course_code',
                'courses.title_kh as course_name',
                'teaching_sessions.title as session_title',
                'teaching_sessions.session_date',
                'teaching_sessions.room as session_room',
                'teaching_sessions.start_time as session_start_time',
                'teaching_sessions.end_time as session_end_time'
            )
            ->first();

        if (!$link) {
            return response()->json(['error' => 'រកមិនឃើញតំណភ្ជាប់ ឬតំណភ្ជាប់នេះត្រូវបានលុបចោល'], 404);
        }

        // Increment access count
        DB::table('share_links')->where('id', $link->id)->increment('access_count');

        // 1. Fetch all members enrolled in this course
        $enrolledMembers = DB::table('course_enrollments')
            ->join('members', 'course_enrollments.member_id', '=', 'members.id')
            ->join('departments', 'members.department_id', '=', 'departments.id')
            ->join('academic_years', 'members.academic_year_id', '=', 'academic_years.id')
            ->where('course_enrollments.course_id', $link->course_id)
            ->select(
                'members.id',
                'members.member_id as memberId',
                'members.student_id as studentId',
                'members.full_name_kh as fullNameKh',
                'members.full_name_en as fullNameEn',
                'departments.code as department',
                'academic_years.code as year'
            )
            ->orderBy('members.member_id', 'asc')
            ->get();

        // 2. Fetch recorded attendance for this session or course
        $attendanceMap = [];
        $attQuery = DB::table('attendance_records');
        if ($link->session_id) {
            $attQuery->where('session_id', $link->session_id);
        } else {
            $attQuery->join('teaching_sessions', 'attendance_records.session_id', '=', 'teaching_sessions.id')
                     ->where('teaching_sessions.course_id', $link->course_id);
        }
        $records = $attQuery->select('attendance_records.member_id', 'attendance_records.status')->get();
        foreach ($records as $rec) {
            $attendanceMap[$rec->member_id] = $rec->status;
        }

        $present = 0;
        $late = 0;
        $absent = 0;
        $excused = 0;
        $pending = 0;

        $formatted = [];
        foreach ($enrolledMembers as $index => $m) {
            $status = $attendanceMap[$m->id] ?? 'PENDING';
            if ($status === 'PRESENT') $present++;
            elseif ($status === 'LATE') $late++;
            elseif ($status === 'ABSENT') $absent++;
            elseif ($status === 'EXCUSED') $excused++;
            else $pending++;

            $formatted[] = [
                'no' => $index + 1,
                'memberId' => $m->memberId,
                'studentId' => $m->studentId,
                'fullNameKh' => $m->fullNameKh,
                'fullNameEn' => $m->fullNameEn,
                'department' => $m->department,
                'year' => $m->year,
                'status' => $status,
            ];
        }

        $total = count($formatted);
        $markedTotal = $present + $late + $absent + $excused;
        $effective = max(0, $markedTotal - $excused);
        $rate = $effective > 0 ? round((($present + $late) / $effective) * 100, 1) : 100.0;

        $reportType = $link->session_id ? 'SESSION' : 'COURSE';

        return response()->json([
            'success' => true,
            'title' => $link->title,
            'reportType' => $reportType,
            'courseCode' => $link->course_code,
            'courseName' => $link->course_name,
            'sessionTitle' => $link->session_title,
            'sessionDate' => $link->session_date ? substr($link->session_date, 0, 10) : null,
            'sessionRoom' => $link->session_room,
            'sessionTime' => ($link->session_start_time && $link->session_end_time)
                ? ($link->session_start_time . ' - ' . $link->session_end_time)
                : null,
            'showStats' => (bool)$link->show_stats,
            'stats' => [
                'total' => $total,
                'present' => $present,
                'late' => $late,
                'absent' => $absent,
                'excused' => $excused,
                'pending' => $pending,
                'rate' => $rate,
            ],
            'members' => $formatted,
        ]);
    }

    /**
     * List all active share links
     * GET /api/share-links
     */
    public function index()
    {
        $links = DB::table('share_links')
            ->join('courses', 'share_links.course_id', '=', 'courses.id')
            ->leftJoin('teaching_sessions', 'share_links.session_id', '=', 'teaching_sessions.id')
            ->where('share_links.is_revoked', false)
            ->select(
                'share_links.*',
                'courses.code as course_code',
                'courses.title_kh as course_name',
                'teaching_sessions.title as session_title',
                'teaching_sessions.session_date'
            )
            ->orderBy('share_links.created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'links' => $links,
        ]);
    }

    /**
     * Create a new share link
     * POST /api/share-links
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'courseId' => 'required|string',
            'sessionId' => 'nullable|string',
            'title' => 'required|string|min:3',
            'showStats' => 'nullable|boolean',
        ]);

        $token = 'stj-' . \Illuminate\Support\Str::random(12);
        $id = 'sl-' . \Illuminate\Support\Str::uuid();

        // Resolve course ID if code passed
        $course = DB::table('courses')->where('id', $validated['courseId'])->orWhere('code', $validated['courseId'])->first();
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        DB::table('share_links')->insert([
            'id' => $id,
            'token' => $token,
            'token_hash' => hash('sha256', $token),
            'course_id' => $course->id,
            'session_id' => !empty($validated['sessionId']) ? $validated['sessionId'] : null,
            'title' => $validated['title'],
            'show_stats' => $validated['showStats'] ?? true,
            'is_revoked' => false,
            'access_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'token' => $token,
            'url' => url('/share/' . $token),
            'message' => 'បានបង្កើតតំណភ្ជាប់ចែករំលែកដោយជោគជ័យ!',
        ], 201);
    }
}
