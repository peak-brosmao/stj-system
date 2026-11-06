<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SetupController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ShareLinkController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\LeaderController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\SessionController;

// 1. One-click Setup & Migration (For Hostinger File Manager users - creates SQLite .db in database/ folder)
Route::get('/setup', [SetupController::class, 'setup']);

// 2. System Dashboard Stats
Route::get('/stats', [StatsController::class, 'index']);

// 3. Members List & Management
Route::get('/members', [MemberController::class, 'index']);
Route::post('/members', [MemberController::class, 'store']);
Route::post('/members/{id}', [MemberController::class, 'update']);
Route::put('/members/{id}', [MemberController::class, 'update']);
Route::delete('/members/{id}', [MemberController::class, 'destroy']);

// 4. Courses Directory
Route::get('/courses', [CourseController::class, 'index']);

// 5. Course Leaders
Route::get('/leaders', [LeaderController::class, 'index']);

// 6. Departments & Academic Years
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/academic-years', [AcademicYearController::class, 'index']);

// 7. Announcements
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/announcements', [AnnouncementController::class, 'store']);

// 8. Teaching Sessions (Lessons)
Route::get('/sessions', [SessionController::class, 'index']);
Route::post('/sessions', [SessionController::class, 'store']);
Route::put('/sessions/{id}', [SessionController::class, 'update']);
Route::delete('/sessions/{id}', [SessionController::class, 'destroy']);

// 8. Attendance Management
Route::get('/attendance/{sessionId}', [AttendanceController::class, 'getBySession']);
Route::post('/attendance', [AttendanceController::class, 'save']);

// 9. Public Share Link Verification
Route::get('/share/{token}', [ShareLinkController::class, 'show']);
Route::post('/share/{token}', [ShareLinkController::class, 'show']);
Route::get('/share-links', [ShareLinkController::class, 'index']);
Route::post('/share-links', [ShareLinkController::class, 'store']);

// 10. Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'UP',
        'system' => 'Senior Teaching Junior (STJ) - ITC',
        'database_connection' => config('database.default'),
        'database_file' => config('database.default') === 'sqlite' ? basename(config('database.connections.sqlite.database')) : 'MySQL',
        'framework' => 'Laravel 13',
        'timestamp' => now()->toIso8601String(),
    ]);
});
