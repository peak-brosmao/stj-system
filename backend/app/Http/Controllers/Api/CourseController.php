<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    /**
     * List all courses
     * GET /api/courses
     */
    public function index()
    {
        try {
            $courses = DB::table('courses')
                ->where('status', 'ACTIVE')
                ->orderBy('code', 'asc')
                ->get();

            $formatted = [];
            foreach ($courses as $c) {
                // Get leader
                $leader = DB::table('course_leaders')
                    ->join('users', 'course_leaders.user_id', '=', 'users.id')
                    ->where('course_leaders.course_id', $c->id)
                    ->select('users.full_name_kh', 'users.full_name_en')
                    ->first();

                $enrolledCount = DB::table('course_enrollments')
                    ->where('course_id', $c->id)
                    ->count();

                $sessionsCount = DB::table('teaching_sessions')
                    ->where('course_id', $c->id)
                    ->count();

                $leaderName = $leader ? ($leader->full_name_kh ?: $leader->full_name_en) : 'មិនទាន់ចាត់តាំង';

                $formatted[] = [
                    'id' => $c->id,
                    'code' => $c->code,
                    'slug' => $c->slug,
                    'titleKh' => $c->title_kh,
                    'titleEn' => $c->title_en,
                    'category' => $c->category ?: 'មូលដ្ឋានគ្រឹះវិស្វកម្ម',
                    'term' => $c->academic_term ?: 'ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧',
                    'status' => $c->status,
                    'leaders' => $leaderName,
                    'enrolled' => $enrolledCount,
                    'sessionsCount' => $sessionsCount,
                ];
            }

            return response()->json([
                'success' => true,
                'courses' => $formatted,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'courses' => [],
            ]);
        }
    }
}

