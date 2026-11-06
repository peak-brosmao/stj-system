<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderController extends Controller
{
    /**
     * List course leaders
     * GET /api/leaders
     */
    public function index()
    {
        try {
            $leaders = DB::table('course_leaders')
                ->join('users', 'course_leaders.user_id', '=', 'users.id')
                ->join('courses', 'course_leaders.course_id', '=', 'courses.id')
                ->leftJoin('members', 'users.member_id', '=', 'members.id')
                ->leftJoin('departments', 'members.department_id', '=', 'departments.id')
                ->leftJoin('academic_years', 'members.academic_year_id', '=', 'academic_years.id')
                ->select(
                    'course_leaders.id',
                    'users.id as userId',
                    'users.full_name_kh as nameKh',
                    'users.full_name_en as nameEn',
                    'users.email',
                    'users.phone',
                    'users.student_id as studentId',
                    'courses.id as courseId',
                    'courses.code as courseCode',
                    'courses.title_kh as courseTitleKh',
                    'departments.code as deptCode',
                    'academic_years.code as yearCode'
                )
                ->get();

            $formatted = $leaders->map(function ($l) {
                return [
                    'id' => $l->id,
                    'nameKh' => $l->nameKh,
                    'nameEn' => $l->nameEn,
                    'studentId' => $l->studentId,
                    'email' => $l->email,
                    'phone' => $l->phone,
                    'course' => $l->courseCode . ' - ' . $l->courseTitleKh,
                    'department' => $l->deptCode ?: 'ITC',
                    'year' => $l->yearCode ?: 'I4',
                    'status' => 'ACTIVE',
                ];
            });

            return response()->json([
                'success' => true,
                'leaders' => $formatted,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'leaders' => [],
            ]);
        }
    }
}

