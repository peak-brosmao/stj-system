<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get system-wide attendance report
     * GET /api/reports
     */
    public function index(Request $request)
    {
        try {
            $academicYearTerm = $request->query('academicYear', '2026-2027');

            // 1. Fetch all active courses
            $courses = DB::table('courses')
                ->where('status', 'ACTIVE')
                ->select('id', 'code', 'title_kh as titleKh', 'title_en as titleEn')
                ->orderBy('code', 'asc')
                ->get();

            // 2. Fetch all teaching sessions
            $sessions = DB::table('teaching_sessions')
                ->where('status', '!=', 'CANCELLED')
                ->select(
                    'id',
                    'course_id',
                    'title',
                    'session_date',
                    DB::raw('CASE 
                        WHEN course_id LIKE "%math%" OR course_id = "cmw4d2517000vt2ds65qa00jv" THEN "MATH101"
                        WHEN course_id LIKE "%prog%" OR course_id = "cmw4d2511000ut2dszz7renau" THEN "PROG101"
                        WHEN course_id LIKE "%phys%" OR course_id = "cmw4d251c000wt2ds8b4t09p2" THEN "PHYS101"
                        WHEN course_id LIKE "%chem%" OR course_id = "cmw4d251i000xt2ds0xxgbubp" THEN "CHEM101"
                        ELSE course_id END as course_code')
                )
                ->orderBy('session_date', 'asc')
                ->get();

            // 3. Fetch all active members
            $members = DB::table('members')
                ->leftJoin('departments', 'members.department_id', '=', 'departments.id')
                ->leftJoin('academic_years', 'members.academic_year_id', '=', 'academic_years.id')
                ->where('members.status', 'ACTIVE')
                ->select(
                    'members.id',
                    'members.member_id as memberId',
                    'members.student_id as studentId',
                    'members.full_name_kh as nameKh',
                    'members.full_name_en as nameEn',
                    'departments.code as dept',
                    'academic_years.code as yr'
                )
                ->orderBy('members.member_id', 'asc')
                ->get();

            // 4. Fetch enrollments cleanly linked to active courses
            $enrollments = DB::table('course_enrollments')
                ->join('courses', 'course_enrollments.course_id', '=', 'courses.id')
                ->select(
                    'course_enrollments.member_id',
                    'courses.id as course_id',
                    'courses.code as course_code'
                )
                ->get();

            $memberCoursesMap = [];
            foreach ($enrollments as $e) {
                if (!isset($memberCoursesMap[$e->member_id])) {
                    $memberCoursesMap[$e->member_id] = [];
                }
                if ($e->course_code && !in_array($e->course_code, $memberCoursesMap[$e->member_id])) {
                    $memberCoursesMap[$e->member_id][] = $e->course_code;
                }
            }

            // 5. Fetch all attendance records
            $attendances = DB::table('attendance_records')
                ->select('session_id', 'member_id', 'status')
                ->get();

            $attMap = [];
            foreach ($attendances as $a) {
                $attMap[$a->session_id . '_' . $a->member_id] = $a->status;
            }

            $totalAttendedCount = 0;
            $totalEligibleCount = 0;
            $membersWithSessionsCount = 0;
            $highPerformersCount = 0;

            $reportItems = [];

            foreach ($members as $idx => $m) {
                $isExecutive = ($m->memberId === 'STJ001' || $m->memberId === 'STJ002');
                $coursesList = $memberCoursesMap[$m->id] ?? [];

                $displayCourse = count($coursesList) > 0 ? implode(', ', $coursesList) : 'Unassigned';
                $executiveRoleTitle = null;

                if ($m->memberId === 'STJ001') {
                    $displayCourse = 'សមាគមនិស្សិត';
                    $executiveRoleTitle = 'គណៈកម្មាធិការសមាគមនិស្សិត';
                } elseif ($m->memberId === 'STJ002') {
                    $displayCourse = 'ប្រធាន STJ';
                    $executiveRoleTitle = 'ប្រធានក្រុមដឹកនាំ STJ';
                }

                if ($isExecutive) {
                    $reportItems[] = [
                        'no' => $idx + 1,
                        'id' => $m->id,
                        'memberId' => $m->memberId,
                        'studentId' => $m->studentId ?: '-',
                        'nameKh' => $m->nameKh,
                        'nameEn' => $m->nameEn,
                        'dept' => $m->dept ?: '-',
                        'yr' => $m->yr ?: '-',
                        'course' => $displayCourse,
                        'courses' => [$displayCourse],
                        'isExecutive' => true,
                        'executiveRoleTitle' => $executiveRoleTitle,
                        'present' => 0,
                        'late' => 0,
                        'absent' => 0,
                        'excused' => 0,
                        'total' => 0,
                        'rate' => 0,
                        'hasSessions' => false,
                    ];
                    continue;
                }

                // Filter sessions to only the courses this tutor teaches
                $memberSessions = $sessions->filter(function ($s) use ($coursesList) {
                    return in_array($s->course_code, $coursesList);
                });

                $totalExpected = $memberSessions->count();
                $present = 0;
                $late = 0;
                $absent = 0;
                $excused = 0;

                foreach ($memberSessions as $s) {
                    $key = $s->id . '_' . $m->id;
                    $status = $attMap[$key] ?? null;

                    if ($status === 'PRESENT') {
                        $present++;
                    } elseif ($status === 'LATE') {
                        $late++;
                    } elseif ($status === 'EXCUSED') {
                        $excused++;
                    } else {
                        $absent++;
                    }
                }

                $total = $totalExpected;
                $eligible = $total - $excused;
                $rate = 0;

                if ($total > 0) {
                    $membersWithSessionsCount++;
                    $rate = $eligible > 0 ? (int)round((($present + $late * 0.5) / $eligible) * 100) : 100;
                    $totalAttendedCount += ($present + $late * 0.5);
                    $totalEligibleCount += $eligible;
                    if ($rate >= 90) {
                        $highPerformersCount++;
                    }
                }

                $reportItems[] = [
                    'no' => $idx + 1,
                    'id' => $m->id,
                    'memberId' => $m->memberId,
                    'studentId' => $m->studentId ?: '-',
                    'nameKh' => $m->nameKh,
                    'nameEn' => $m->nameEn,
                    'dept' => $m->dept ?: '-',
                    'yr' => $m->yr ?: '-',
                    'course' => $displayCourse,
                    'courses' => count($coursesList) > 0 ? $coursesList : ['Unassigned'],
                    'isExecutive' => false,
                    'executiveRoleTitle' => null,
                    'present' => $present,
                    'late' => $late,
                    'absent' => $absent,
                    'excused' => $excused,
                    'total' => $total,
                    'rate' => $total > 0 ? $rate : 0,
                    'hasSessions' => $total > 0,
                ];
            }

            $averageRate = $totalEligibleCount > 0
                ? (int)round(($totalAttendedCount / $totalEligibleCount) * 100)
                : 100;

            return response()->json([
                'success' => true,
                'summary' => [
                    'totalMembers' => count($members),
                    'totalTutors' => count($members) - 2,
                    'totalSessions' => $sessions->count(),
                    'averageRate' => $averageRate,
                    'highPerformers' => $highPerformersCount,
                    'membersWithSessionsCount' => $membersWithSessionsCount,
                ],
                'courses' => $courses,
                'members' => $reportItems,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
