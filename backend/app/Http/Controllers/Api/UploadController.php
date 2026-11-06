<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload User Profile Photo directly to datastj.peakbrosmao.me storage
     * POST /api/upload/profile-photo
     */
    public function uploadProfilePhoto(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
                'userId' => 'nullable|string',
                'studentId' => 'nullable|string',
                'email' => 'nullable|string',
            ]);

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $fileName = 'avatar_' . time() . '_' . Str::random(12) . '.' . $extension;

            // Target directory in public/uploads/avatars/
            $destinationPath = public_path('uploads/avatars');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $fileName);

            $baseUrl = rtrim(config('app.url', url('/')), '/');
            $publicUrl = $baseUrl . '/uploads/avatars/' . $fileName;

            // Update user profile image in database if user identifier provided
            $userId = $request->input('userId');
            $studentId = $request->input('studentId');
            $email = $request->input('email');

            if ($userId || $studentId || $email) {
                DB::table('users')
                    ->where(function ($q) use ($userId, $studentId, $email) {
                        if ($userId) $q->orWhere('id', $userId);
                        if ($studentId) $q->orWhere('student_id', $studentId);
                        if ($email) $q->orWhere('email', $email);
                    })
                    ->update([
                        'profile_image' => $publicUrl,
                        'updated_at' => now(),
                    ]);
            }

            return response()->json([
                'success' => true,
                'url' => $publicUrl,
                'fileName' => $fileName,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

