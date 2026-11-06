<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SessionController extends Controller
{
    /**
     * List teaching sessions (lessons)
     * GET /api/sessions
     */
    public function index(Request $request)
    {
        $query = DB::table('teaching_sessions')
            ->leftJoin('courses', function ($join) {
                $join->on('teaching_sessions.course_id', '=', 'courses.id')
                     ->orOn('teaching_sessions.course_id', '=', 'courses.code');
            })
            ->select(
                'teaching_sessions.id',
                'teaching_sessions.course_id as courseId',
                DB::raw('COALESCE(courses.code, CASE 
                    WHEN teaching_sessions.course_id LIKE "%math%" OR teaching_sessions.course_id = "cmw4d2517000vt2ds65qa00jv" THEN "MATH101"
                    WHEN teaching_sessions.course_id LIKE "%prog%" OR teaching_sessions.course_id = "cmw4d2511000ut2dszz7renau" THEN "PROG101"
                    WHEN teaching_sessions.course_id LIKE "%phys%" OR teaching_sessions.course_id = "cmw4d251c000wt2ds8b4t09p2" THEN "PHYS101"
                    WHEN teaching_sessions.course_id LIKE "%chem%" OR teaching_sessions.course_id = "cmw4d251i000xt2ds0xxgbubp" THEN "CHEM101"
                    ELSE teaching_sessions.course_id END) as courseCode'),
                DB::raw('COALESCE(courses.title_kh, "មុខវិជ្ជា STJ") as courseTitleKh'),
                'teaching_sessions.title',
                'teaching_sessions.session_date as sessionDate',
                'teaching_sessions.start_time as startTime',
                'teaching_sessions.end_time as endTime',
                'teaching_sessions.room',
                'teaching_sessions.status',
                'teaching_sessions.notes',
                'teaching_sessions.created_at as createdAt'
            );

        if ($request->has('course') && $request->query('course') !== 'ALL') {
            $filter = $request->query('course');
            $query->where(function ($q) use ($filter) {
                $q->where('courses.code', $filter)
                  ->orWhere('courses.id', $filter)
                  ->orWhere('teaching_sessions.course_id', $filter);
            });
        }

        $sessions = $query->orderBy('teaching_sessions.session_date', 'desc')->get();

        // Fetch active share links mapped by session_id
        $shareLinks = DB::table('share_links')
            ->where('is_revoked', false)
            ->whereNotNull('session_id')
            ->pluck('token', 'session_id');

        // Attach attendance count and shareToken to each session
        $formatted = $sessions->map(function ($s) use ($shareLinks) {
            $markedCount = DB::table('attendance_records')
                ->where('session_id', $s->id)
                ->whereIn('status', ['PRESENT', 'LATE'])
                ->count();

            $totalRecords = DB::table('attendance_records')
                ->where('session_id', $s->id)
                ->count();

            return [
                'id' => $s->id,
                'courseId' => $s->courseId,
                'courseCode' => $s->courseCode,
                'courseTitleKh' => $s->courseTitleKh,
                'course' => [
                    'id' => $s->courseId,
                    'code' => $s->courseCode,
                    'titleKh' => $s->courseTitleKh,
                ],
                'title' => $s->title,
                'sessionDate' => substr($s->sessionDate, 0, 10),
                'startTime' => $s->startTime,
                'endTime' => $s->endTime,
                'room' => $s->room,
                'status' => $s->status,
                'notes' => $s->notes,
                'markedCount' => $markedCount,
                'totalAttendance' => $totalRecords,
                '_count' => [
                    'attendance' => $totalRecords,
                ],
                'shareToken' => $shareLinks[$s->id] ?? null,
            ];
        });

        return response()->json([
            'success' => true,
            'sessions' => $formatted,
        ]);
    }

    /**
     * Create a new lesson / session
     * POST /api/sessions
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'courseId' => 'required|string',
            'title' => 'required|string|min:2|max:255',
            'sessionDate' => 'required|string',
            'startTime' => 'required|string',
            'endTime' => 'required|string',
            'room' => 'required|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        // Resolve course ID
        $course = DB::table('courses')
            ->where('id', $validated['courseId'])
            ->orWhere('code', $validated['courseId'])
            ->orWhere('slug', $validated['courseId'])
            ->first();

        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $id = (string) Str::uuid();
        $now = now();

        DB::table('teaching_sessions')->insert([
            'id' => $id,
            'course_id' => $course->id,
            'title' => strip_tags($validated['title']),
            'session_date' => $validated['sessionDate'],
            'start_time' => $validated['startTime'],
            'end_time' => $validated['endTime'],
            'room' => strip_tags($validated['room']),
            'notes' => isset($validated['notes']) ? strip_tags($validated['notes']) : null,
            'status' => $validated['status'] ?? 'SCHEDULED',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return response()->json([
            'success' => true,
            'session' => [
                'id' => $id,
                'courseId' => $course->id,
                'title' => $validated['title'],
            ],
            'message' => 'បានបង្កើតមេរៀន/វគ្គបង្រៀនចូល Database ជោគជ័យ',
        ], 201);
    }

    /**
     * Update an existing lesson / session
     * PUT /api/sessions/{id}
     */
    public function update(Request $request, $id)
    {
        $session = DB::table('teaching_sessions')->where('id', $id)->first();
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|min:2',
            'sessionDate' => 'nullable|string',
            'startTime' => 'nullable|string',
            'endTime' => 'nullable|string',
            'room' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['title'])) $updateData['title'] = strip_tags($validated['title']);
        if (isset($validated['sessionDate'])) $updateData['session_date'] = $validated['sessionDate'];
        if (isset($validated['startTime'])) $updateData['start_time'] = $validated['startTime'];
        if (isset($validated['endTime'])) $updateData['end_time'] = $validated['endTime'];
        if (isset($validated['room'])) $updateData['room'] = strip_tags($validated['room']);
        if (isset($validated['notes'])) $updateData['notes'] = strip_tags($validated['notes']);
        if (isset($validated['status'])) $updateData['status'] = $validated['status'];
        $updateData['updated_at'] = now();

        DB::table('teaching_sessions')->where('id', $id)->update($updateData);

        return response()->json(['success' => true, 'message' => 'បានកែប្រែមេរៀនជោគជ័យ']);
    }

    /**
     * Delete a lesson / session
     * DELETE /api/sessions/{id}
     */
    public function destroy($id)
    {
        $session = DB::table('teaching_sessions')->where('id', $id)->first();
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        DB::table('attendance_records')->where('session_id', $id)->delete();
        DB::table('teaching_sessions')->where('id', $id)->delete();

        return response()->json(['success' => true, 'message' => 'បានលុបមេរៀនជោគជ័យ']);
    }
}
