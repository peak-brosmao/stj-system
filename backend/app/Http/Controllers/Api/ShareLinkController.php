<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShareLinkController extends Controller
{
    public function show($token)
    {
        $link = DB::table('share_links')
            ->join('courses', 'share_links.course_id', '=', 'courses.id')
            ->where('share_links.token', $token)
            ->where('share_links.is_revoked', false)
            ->select(
                'share_links.*',
                'courses.code as course_code',
                'courses.title_kh as course_name'
            )
            ->first();

        if (!$link) {
            return response()->json(['error' => 'រកមិនឃើញតំណភ្ជាប់ ឬតំណភ្ជាប់នេះត្រូវបានលុបចោល'], 404);
        }

        // Increment access count
        DB::table('share_links')->where('id', $link->id)->increment('access_count');

        // Fetch attendance records for this course / session
        $query = DB::table('attendance_records')
            ->join('members', 'attendance_records.member_id', '=', 'members.id')
            ->join('departments', 'members.department_id', '=', 'departments.id')
            ->join('academic_years', 'members.academic_year_id', '=', 'academic_years.id')
            ->join('teaching_sessions', 'attendance_records.session_id', '=', 'teaching_sessions.id');

        if ($link->session_id) {
            $query->where('attendance_records.session_id', $link->session_id);
        } else {
            $query->where('teaching_sessions.course_id', $link->course_id);
        }

        $records = $query->select(
            'members.member_id as memberId',
            'members.full_name_kh as fullNameKh',
            'members.full_name_en as fullNameEn',
            'departments.code as department',
            'academic_years.code as year',
            'attendance_records.status'
        )->orderBy('members.member_id', 'asc')->get();

        $present = $records->where('status', 'PRESENT')->count();
        $late = $records->where('status', 'LATE')->count();
        $absent = $records->where('status', 'ABSENT')->count();
        $excused = $records->where('status', 'EXCUSED')->count();
        $total = $records->count();

        $effectiveTotal = max(0, $total - $excused);
        $rate = $effectiveTotal > 0 ? round((($present + $late) / $effectiveTotal) * 100, 1) : 100;

        return response()->json([
            'title' => $link->title,
            'courseCode' => $link->course_code,
            'courseName' => $link->course_name,
            'showStats' => (bool)$link->show_stats,
            'stats' => [
                'total' => $total,
                'present' => $present,
                'late' => $late,
                'absent' => $absent,
                'excused' => $excused,
                'rate' => $rate,
            ],
            'members' => $records->values()->map(function ($r, $i) {
                return array_merge((array)$r, ['no' => $i + 1]);
            }),
        ]);
    }
}

