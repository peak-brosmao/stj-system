<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('members')
            ->join('departments', 'members.department_id', '=', 'departments.id')
            ->join('academic_years', 'members.academic_year_id', '=', 'academic_years.id')
            ->leftJoin('course_enrollments', 'members.id', '=', 'course_enrollments.member_id')
            ->leftJoin('courses', 'course_enrollments.course_id', '=', 'courses.id')
            ->select(
                'members.id',
                'members.member_id as memberId',
                'members.student_id as studentId',
                'members.full_name_kh as fullNameKh',
                'members.full_name_en as fullNameEn',
                'members.email',
                'members.phone',
                'members.gender',
                'members.status',
                'departments.code as departmentCode',
                'departments.name_kh as departmentNameKh',
                'academic_years.code as yearCode',
                'courses.code as courseCode',
                'courses.title_kh as courseTitleKh'
            );

        if ($request->has('course')) {
            $query->where('courses.code', $request->query('course'));
        }

        $members = $query->orderBy('members.member_id', 'asc')->get();

        return response()->json([
            'success' => true,
            'count' => $members->count(),
            'members' => $members,
        ]);
    }
}

