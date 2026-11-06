<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SetupController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ShareLinkController;

// 1. One-click Setup & Migration (For Hostinger File Manager extraction)
Route::get('/setup', [SetupController::class, 'setup']);

// 2. Members List
Route::get('/members', [MemberController::class, 'index']);

// 3. Attendance Management
Route::get('/attendance/{sessionId}', [AttendanceController::class, 'getBySession']);
Route::post('/attendance', [AttendanceController::class, 'save']);

// 4. Public Share Link Verification
Route::get('/share/{token}', [ShareLinkController::class, 'show']);
Route::post('/share/{token}', [ShareLinkController::class, 'show']);

// 5. Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'UP',
        'system' => 'Senior Teaching Junior (STJ) - ITC',
        'framework' => 'Laravel 13',
        'timestamp' => now()->toIso8601String(),
    ]);
});
