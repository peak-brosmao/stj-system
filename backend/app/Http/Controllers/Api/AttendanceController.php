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

        $leader = DB::table('course_leaders')
            ->join('users', 'course_leaders.user_id', '=', 'users.id')
            ->where('course_leaders.course_id', $session->course_id)
            ->select('users.student_id')
            ->first();
        $leaderStudentId = $leader ? $leader->student_id : null;

        $officialLeaders = ['e20240704', 'e20221423', 'e20240096', 'e20240046'];

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
            ->get()
            ->map(function ($m) use ($leaderStudentId, $officialLeaders) {
                $isLeader = ($m->studentId === $leaderStudentId) || in_array($m->studentId, $officialLeaders);
                return [
                    'id' => $m->id,
                    'memberId' => $m->memberId,
                    'studentId' => $m->studentId,
                    'fullNameKh' => $m->fullNameKh,
                    'fullNameEn' => $m->fullNameEn,
                    'department' => ['code' => $m->departmentCode],
                    'academicYear' => ['code' => $m->yearCode],
                    'isLeader' => $isLeader,
                ];
            })
            ->sort(function ($a, $b) {
                if ($a['isLeader'] && !$b['isLeader']) return -1;
                if (!$a['isLeader'] && $b['isLeader']) return 1;

                preg_match('/(\d+)/', $a['academicYear']['code'] ?? '', $mA);
                preg_match('/(\d+)/', $b['academicYear']['code'] ?? '', $mB);
                $yearA = isset($mA[1]) ? (int)$mA[1] : 99;
                $yearB = isset($mB[1]) ? (int)$mB[1] : 99;
                if ($yearA !== $yearB) return $yearA - $yearB;

                return strcasecmp($a['fullNameEn'], $b['fullNameEn']);
            })
            ->values();

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
                $member = DB::table('members')
                    ->where('id', $r['memberId'])
                    ->orWhere('member_id', $r['memberId'])
                    ->orWhere('student_id', $r['memberId'])
                    ->first();
                $targetMemberId = $member ? $member->id : $r['memberId'];

                DB::table('attendance_records')->updateOrInsert(
                    ['session_id' => $sessionId, 'member_id' => $targetMemberId],
                    [
                        'id' => 'att-' . $sessionId . '-' . $targetMemberId,
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

