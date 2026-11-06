<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * Get system statistics for Dashboard
     * GET /api/stats
     */
    public function index()
    {
        try {
            $totalMembers = DB::table('members')->count();
            $activeMembers = DB::table('members')->where('status', 'ACTIVE')->count();
            $totalLeaders = DB::table('course_leaders')->count();
            $totalCourses = DB::table('courses')->where('status', 'ACTIVE')->count();
            $totalSessions = DB::table('teaching_sessions')->count();

            // Calculate attendance rate
            $attendances = DB::table('attendance_records')
                ->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status');

            $present = $attendances['PRESENT'] ?? 0;
            $late = $attendances['LATE'] ?? 0;
            $absent = $attendances['ABSENT'] ?? 0;
            $excused = $attendances['EXCUSED'] ?? 0;

            $totalRecords = $present + $late + $absent + $excused;
            $effective = $totalRecords - $excused;
            $attendanceRate = $effective > 0 ? round((($present + $late) / $effective) * 100, 1) : 100.0;

            // Dept distribution
            $deptDistribution = DB::table('departments')
                ->leftJoin('members', 'departments.id', '=', 'members.department_id')
                ->select('departments.code as name', DB::raw('count(members.id) as count'))
                ->groupBy('departments.code')
                ->orderBy('departments.code')
                ->get();

            // Year distribution
            $yearDistribution = DB::table('academic_years')
                ->leftJoin('members', 'academic_years.id', '=', 'members.academic_year_id')
                ->select('academic_years.code as name', DB::raw('count(members.id) as count'))
                ->groupBy('academic_years.code', 'academic_years.order')
                ->orderBy('academic_years.order')
                ->get();

            // Recent sessions
            $recentSessions = DB::table('teaching_sessions')
                ->leftJoin('courses', function ($join) {
                    $join->on('teaching_sessions.course_id', '=', 'courses.id')
                         ->orOn('teaching_sessions.course_id', '=', 'courses.code');
                })
                ->select(
                    'teaching_sessions.id',
                    'teaching_sessions.title',
                    DB::raw('COALESCE(courses.code, CASE 
                        WHEN teaching_sessions.course_id LIKE "%math%" OR teaching_sessions.course_id = "cmw4d2517000vt2ds65qa00jv" THEN "MATH101"
                        WHEN teaching_sessions.course_id LIKE "%prog%" OR teaching_sessions.course_id = "cmw4d2511000ut2dszz7renau" THEN "PROG101"
                        WHEN teaching_sessions.course_id LIKE "%phys%" OR teaching_sessions.course_id = "cmw4d251c000wt2ds8b4t09p2" THEN "PHYS101"
                        WHEN teaching_sessions.course_id LIKE "%chem%" OR teaching_sessions.course_id = "cmw4d251i000xt2ds0xxgbubp" THEN "CHEM101"
                        ELSE teaching_sessions.course_id END) as course'),
                    'teaching_sessions.session_date as date',
                    'teaching_sessions.status'
                )
                ->orderBy('teaching_sessions.session_date', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'summary' => [
                    'totalMembers' => $totalMembers,
                    'activeMembers' => $activeMembers,
                    'totalLeaders' => $totalLeaders,
                    'totalCourses' => $totalCourses,
                    'totalSessions' => $totalSessions,
                    'attendanceRate' => $attendanceRate,
                ],
                'charts' => [
                    'deptDistribution' => $deptDistribution,
                    'yearDistribution' => $yearDistribution,
                ],
                'recentSessions' => $recentSessions,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'summary' => [
                    'totalMembers' => 0,
                    'activeMembers' => 0,
                    'totalLeaders' => 0,
                    'totalCourses' => 0,
                    'totalSessions' => 0,
                    'attendanceRate' => 0,
                ],
                'charts' => [
                    'deptDistribution' => [],
                    'yearDistribution' => [],
                ],
                'recentSessions' => [],
            ], 200);
        }
    }
}

