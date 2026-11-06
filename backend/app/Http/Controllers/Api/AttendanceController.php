<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AttendanceController extends Controller
{
    public function getBySession($sessionId)
    {
        $session = DB::table('teaching_sessions')->where('id', $sessionId)->first();
        if (!$session) {
            return response()->json(['error' => 'រកមិនឃើញវគ្គបង្រៀននេះឡើយ'], 404);
        }

        $records = DB::table('attendance_records')
            ->where('session_id', $sessionId)
            ->get();

        $enrolledMembers = DB::table('course_enrollments')
            ->join('members', 'course_enrollments.member_id', '=', 'members.id')
            ->join('departments', 'members.department_id', '=', 'departments.id')
            ->join('academic_years', 'members.academic_year_id', '=', 'academic_years.id')
            ->where('course_enrollments.course_id', $session->course_id)
            ->select(
                'members.id',
                'members.member_id as memberId',
                'members.student_id as studentId',
                'members.full_name_kh as fullNameKh',
                'members.full_name_en as fullNameEn',
                'departments.code as departmentCode',
                'academic_years.code as yearCode'
            )
            ->orderBy('members.member_id', 'asc')
            ->get();

        return response()->json([
            'session' => $session,
            'enrolledMembers' => $enrolledMembers,
            'attendanceRecords' => $records,
        ]);
    }

    public function save(Request $request)
    {
        $validated = $request->validate([
            'sessionId' => 'required|string',
            'records' => 'required|array',
            'records.*.memberId' => 'required|string',
            'records.*.status' => 'required|string',
            'records.*.remarks' => 'nullable|string',
            'finalize' => 'nullable|boolean',
        ]);

        $sessionId = $validated['sessionId'];
        $session = DB::table('teaching_sessions')->where('id', $sessionId)->first();
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        DB::transaction(function () use ($sessionId, $validated) {
            foreach ($validated['records'] as $r) {
                DB::table('attendance_records')->updateOrInsert(
                    ['session_id' => $sessionId, 'member_id' => $r['memberId']],
                    [
                        'id' => 'rec-' . Str::uuid(),
                        'status' => $r['status'],
                        'remarks' => $r['remarks'] ?? null,
                        'updated_at' => now(),
                    ]
                );
            }

            if (!empty($validated['finalize'])) {
                DB::table('teaching_sessions')
                    ->where('id', $sessionId)
                    ->update(['status' => 'COMPLETED', 'updated_at' => now()]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'វត្តមានត្រូវបានរក្សាទុកដោយជោគជ័យ!',
        ]);
    }
}

