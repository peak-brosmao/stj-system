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
                    'category' => (property_exists($c, 'category') && $c->category) ? $c->category : 'មូលដ្ឋានគ្រឹះវិស្វកម្ម',
                    'term' => (property_exists($c, 'academic_term') ? $c->academic_term : ($c->academic_year ?? '2026-2027')) ?: 'ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧',
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

    /**
     * Create a new course
     * POST /api/courses
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'titleKh' => 'required|string',
            'titleEn' => 'nullable|string',
            'category' => 'nullable|string',
            'term' => 'nullable|string',
            'leaderStudentId' => 'nullable|string',
            'leaderUserId' => 'nullable',
        ]);

        $code = strtoupper(trim($validated['code']));
        $slug = strtolower($code);
        $courseId = 'course-' . strtolower($code);

        DB::table('courses')->updateOrInsert(
            ['id' => $courseId],
            [
                'id' => $courseId,
                'code' => $code,
                'slug' => $slug,
                'title_kh' => $validated['titleKh'],
                'title_en' => $validated['titleEn'] ?? $validated['titleKh'],
                'academic_year' => $validated['term'] ?? '2026-2027',
                'semester' => 'Semester 1',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Assign leader if specified
        $leaderIdentifier = $validated['leaderStudentId'] ?? $validated['leaderUserId'] ?? null;
        if (!empty($leaderIdentifier)) {
            $user = DB::table('users')
                ->where('student_id', $leaderIdentifier)
                ->orWhere('id', $leaderIdentifier)
                ->orWhere('member_id', $leaderIdentifier)
                ->first();

            if ($user) {
                DB::table('course_leaders')->where('course_id', $courseId)->delete();
                DB::table('course_leaders')->insert([
                    'course_id' => $courseId,
                    'user_id' => $user->id,
                    'assigned_at' => now(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'បានបង្កើតមុខវិជ្ជាថ្មី ' . $code . ' ដោយជោគជ័យ!',
            'course' => [
                'id' => $courseId,
                'code' => $code,
                'slug' => $slug,
                'titleKh' => $validated['titleKh'],
                'titleEn' => $validated['titleEn'] ?? $validated['titleKh'],
            ],
        ], 201);
    }

    /**
     * Update an existing course
     * POST /api/courses/{id} or PUT
     */
    public function update(Request $request, $id)
    {
        $course = DB::table('courses')->where('id', $id)->orWhere('code', $id)->first();
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $validated = $request->validate([
            'titleKh' => 'nullable|string',
            'titleEn' => 'nullable|string',
            'category' => 'nullable|string',
            'term' => 'nullable|string',
            'status' => 'nullable|string',
            'leaderStudentId' => 'nullable|string',
            'leaderUserId' => 'nullable',
        ]);

        $update = ['updated_at' => now()];
        if (!empty($validated['titleKh'])) $update['title_kh'] = $validated['titleKh'];
        if (!empty($validated['titleEn'])) $update['title_en'] = $validated['titleEn'];
        if (!empty($validated['status'])) $update['status'] = $validated['status'];
        if (!empty($validated['term'])) $update['academic_year'] = $validated['term'];

        DB::table('courses')->where('id', $course->id)->update($update);

        // Update leader if provided
        $leaderIdentifier = $validated['leaderStudentId'] ?? $validated['leaderUserId'] ?? null;
        if (!empty($leaderIdentifier)) {
            $user = DB::table('users')
                ->where('student_id', $leaderIdentifier)
                ->orWhere('id', $leaderIdentifier)
                ->orWhere('member_id', $leaderIdentifier)
                ->first();

            if ($user) {
                DB::table('course_leaders')->where('course_id', $course->id)->delete();
                DB::table('course_leaders')->insert([
                    'course_id' => $course->id,
                    'user_id' => $user->id,
                    'assigned_at' => now(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'បានកែប្រែព័ត៌មានមុខវិជ្ជាជោគជ័យ!',
        ]);
    }

    /**
     * Delete or deactivate a course
     * DELETE /api/courses/{id}
     */
    public function destroy($id)
    {
        $course = DB::table('courses')->where('id', $id)->orWhere('code', $id)->first();
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        DB::table('courses')->where('id', $course->id)->update(['status' => 'INACTIVE', 'updated_at' => now()]);
        return response()->json([
            'success' => true,
            'message' => 'បានលុប ឬផ្អាកមុខវិជ្ជាជោគជ័យ!',
        ]);
    }
    }
}

