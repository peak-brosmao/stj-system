<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    /**
     * List all members with multi-course support
     * GET /api/members
     */
    public function index(Request $request)
    {
        $members = DB::table('members')
            ->join('departments', 'members.department_id', '=', 'departments.id')
            ->join('academic_years', 'members.academic_year_id', '=', 'academic_years.id')
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
                'departments.id as departmentId',
                'departments.code as departmentCode',
                'departments.name_kh as departmentNameKh',
                'academic_years.id as academicYearId',
                'academic_years.code as yearCode'
            )
            ->orderBy('members.member_id', 'asc')
            ->get();

        // Fetch all enrollments with courses
        $enrollments = DB::table('course_enrollments')
            ->join('courses', 'course_enrollments.course_id', '=', 'courses.id')
            ->select(
                'course_enrollments.member_id',
                'courses.id as courseId',
                'courses.code as courseCode',
                'courses.title_kh as courseTitleKh',
                'courses.title_en as courseTitleEn'
            )
            ->get()
            ->groupBy('member_id');

        $formatted = $members->map(function ($m) use ($enrollments) {
            $memberEnrollments = $enrollments->get($m->id, collect());
            $courses = $memberEnrollments->map(function ($e) {
                return [
                    'id' => $e->courseId,
                    'code' => $e->courseCode,
                    'titleKh' => $e->courseTitleKh,
                    'titleEn' => $e->courseTitleEn,
                ];
            })->values()->all();

            $courseCodes = $memberEnrollments->pluck('courseCode')->all();

            return [
                'id' => $m->id,
                'memberId' => $m->memberId,
                'studentId' => $m->studentId,
                'fullNameKh' => $m->fullNameKh,
                'fullNameEn' => $m->fullNameEn,
                'email' => $m->email,
                'phone' => $m->phone,
                'gender' => $m->gender,
                'status' => $m->status,
                'departmentId' => $m->departmentId,
                'academicYearId' => $m->academicYearId,
                'department' => [
                    'id' => $m->departmentId,
                    'code' => $m->departmentCode,
                    'nameKh' => $m->departmentNameKh,
                ],
                'academicYear' => [
                    'id' => $m->academicYearId,
                    'code' => $m->yearCode,
                    'label' => $m->yearCode,
                ],
                'courses' => $courses,
                'courseCodes' => $courseCodes,
                'enrollments' => array_map(function ($c) {
                    return [
                        'id' => 'enr-' . $c['id'],
                        'courseId' => $c['id'],
                        'course' => $c,
                    ];
                }, $courses),
            ];
        });

        // Filter by course if requested
        if ($request->has('course') && $request->query('course') !== 'ALL') {
            $targetCourse = $request->query('course');
            $formatted = $formatted->filter(function ($m) use ($targetCourse) {
                return in_array($targetCourse, $m['courseCodes']);
            })->values();
        }

        return response()->json([
            'success' => true,
            'count' => $formatted->count(),
            'members' => $formatted,
        ]);
    }

    /**
     * Update member courses and details
     * POST /api/members/{id} or PUT
     */
    public function update(Request $request, $id)
    {
        $member = DB::table('members')->where('id', $id)->orWhere('member_id', $id)->first();
        if (!$member) {
            return response()->json(['error' => 'Member not found'], 404);
        }

        $validated = $request->validate([
            'fullNameKh' => 'nullable|string',
            'fullNameEn' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'departmentId' => 'nullable|string',
            'academicYearId' => 'nullable|string',
            'courseIds' => 'nullable|array',
            'status' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['fullNameKh'])) $updateData['full_name_kh'] = $validated['fullNameKh'];
        if (isset($validated['fullNameEn'])) $updateData['full_name_en'] = $validated['fullNameEn'];
        if (isset($validated['phone'])) $updateData['phone'] = $validated['phone'];
        if (isset($validated['email'])) $updateData['email'] = $validated['email'];
        if (isset($validated['departmentId'])) $updateData['department_id'] = $validated['departmentId'];
        if (isset($validated['academicYearId'])) $updateData['academic_year_id'] = $validated['academicYearId'];
        if (isset($validated['status'])) $updateData['status'] = $validated['status'];
        $updateData['updated_at'] = now();

        DB::table('members')->where('id', $member->id)->update($updateData);

        // Update multi-course enrollments
        if (isset($validated['courseIds'])) {
            DB::table('course_enrollments')->where('member_id', $member->id)->delete();
            foreach ($validated['courseIds'] as $cId) {
                if (!empty($cId)) {
                    DB::table('course_enrollments')->insert([
                        'id' => (string) Str::uuid(),
                        'course_id' => $cId,
                        'member_id' => $member->id,
                        'enrolled_at' => now(),
                        'status' => 'ACTIVE',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'បានកែប្រែព័ត៌មាន និងមុខវិជ្ជាជោគជ័យ']);
    }

    /**
     * Store a newly created member
     * POST /api/members
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'studentId' => 'required|string',
            'fullNameKh' => 'required|string',
            'fullNameEn' => 'required|string',
            'departmentId' => 'required|string',
            'academicYearId' => 'required|string',
            'courseIds' => 'nullable|array',
            'phone' => 'nullable|string',
            'gender' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Auto-generate next STJ Member ID safely
        $existingMemberIds = DB::table('members')->pluck('member_id');
        $maxNum = 0;
        foreach ($existingMemberIds as $mid) {
            if (preg_match('/^STJ(\d+)$/i', $mid, $m)) {
                $n = (int)$m[1];
                if ($n > $maxNum) $maxNum = $n;
            }
        }
        $nextNum = $maxNum + 1;
        $memberId = 'STJ' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

        $uuid = 'member-' . Str::uuid();
        $email = strtolower(trim($validated['studentId'])) . '@itc.edu.kh';

        DB::table('members')->insert([
            'id' => $uuid,
            'member_id' => $memberId,
            'student_id' => $validated['studentId'],
            'full_name_kh' => $validated['fullNameKh'],
            'full_name_en' => $validated['fullNameEn'],
            'email' => $email,
            'phone' => $validated['phone'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'department_id' => $validated['departmentId'],
            'academic_year_id' => $validated['academicYearId'],
            'status' => 'ACTIVE',
            'notes' => $validated['notes'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create user login
        $userId = DB::table('users')->insertGetId([
            'name' => $validated['fullNameEn'],
            'full_name_kh' => $validated['fullNameKh'],
            'full_name_en' => $validated['fullNameEn'],
            'email' => $email,
            'student_id' => $validated['studentId'],
            'role' => 'MEMBER',
            'member_id' => $memberId,
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Enroll in courses
        if (!empty($validated['courseIds'])) {
            foreach ($validated['courseIds'] as $cId) {
                if (!empty($cId)) {
                    DB::table('course_enrollments')->insert([
                        'id' => (string) Str::uuid(),
                        'course_id' => $cId,
                        'member_id' => $uuid,
                        'enrolled_at' => now(),
                        'status' => 'ACTIVE',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'បានបង្កើតសមាជិក ' . $validated['fullNameKh'] . ' (' . $memberId . ') ដោយជោគជ័យ!',
            'member' => [
                'id' => $uuid,
                'memberId' => $memberId,
                'studentId' => $validated['studentId'],
                'fullNameKh' => $validated['fullNameKh'],
                'fullNameEn' => $validated['fullNameEn'],
            ],
        ], 201);
    }

    /**
     * Delete a member
     * DELETE /api/members/{id}
     */
    public function destroy($id)
    {
        $member = DB::table('members')->where('id', $id)->orWhere('member_id', $id)->first();
        if (!$member) {
            return response()->json(['error' => 'Member not found'], 404);
        }

        DB::table('course_enrollments')->where('member_id', $member->id)->delete();
        DB::table('attendance_records')->where('member_id', $member->id)->delete();
        DB::table('members')->where('id', $member->id)->delete();
        DB::table('users')->where('student_id', $member->student_id)->orWhere('member_id', $member->member_id)->delete();

        return response()->json(['success' => true, 'message' => 'បានលុបសមាជិកជោគជ័យ']);
    }
}
