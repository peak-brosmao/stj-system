<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class SetupController extends Controller
{
    /**
     * Browser-based 1-click Database Initializer for Hostinger File Manager users
     * Creates database.sqlite file inside database/ folder if using SQLite
     * Access: GET /api/setup?key=stj2026
     */
    public function setup(Request $request)
    {
        if ($request->query('key') !== 'stj2026') {
            return response()->json([
                'success' => false,
                'message' => 'សូមបញ្ចូល Security Key ត្រឹមត្រូវ: ?key=stj2026',
            ], 403);
        }

        try {
            $dbConnection = config('database.default', 'sqlite');
            $dbPath = database_path('stj.db');

            if ($dbConnection === 'sqlite') {
                $customPath = env('DB_DATABASE');
                if (!empty($customPath) && !str_contains($customPath, 'database.sqlite')) {
                    $dbPath = str_starts_with($customPath, '/') || str_contains($customPath, ':')
                        ? $customPath
                        : base_path($customPath);
                } else {
                    $dbPath = database_path('stj.db');
                }

                // Force SQLite to use the .db file
                config(['database.connections.sqlite.database' => $dbPath]);
                DB::purge('sqlite');

                $dir = dirname($dbPath);
                if (!is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }

                if (!file_exists($dbPath)) {
                    touch($dbPath);
                    chmod($dbPath, 0666);
                }
            }

            Artisan::call('migrate:fresh', ['--force' => true]);
            $migrateOutput = Artisan::output();

            Artisan::call('db:seed', ['--class' => 'StjDatabaseSeeder', '--force' => true]);
            $seedOutput = Artisan::output();

            $memberCount = DB::table('members')->count();
            $courseCount = DB::table('courses')->count();
            $userCount = DB::table('users')->count();
            $sessionCount = DB::table('teaching_sessions')->count();

            return response()->json([
                'success' => true,
                'message' => 'STJ Database Migration & Seeding ជោគជ័យ ១០០%!',
                'database' => [
                    'connection' => $dbConnection,
                    'file_path' => basename($dbPath) . ' (ស្ថិតក្នុង folder: database/)',
                    'backup_instruction' => 'លោកអ្នកអាច Download ឯកសារ ' . basename($dbPath) . ' ក្នុង folder database/ មកកុំព្យូទ័របានគ្រប់ពេលដើម្បីធ្វើ Backup ឬបើកមើលជាមួយ DB Browser for SQLite',
                ],
                'summary' => [
                    'database_file' => basename($dbPath),
                    'members_seeded' => $memberCount,
                    'courses_seeded' => $courseCount,
                    'sessions_seeded' => $sessionCount,
                    'users_seeded' => $userCount,
                    'leadership_roles' => [
                        'STJ001' => 'សុខ សេងលី (គណៈកម្មាធិការសមាគមនិស្សិត - មិនបង្រៀន)',
                        'STJ002' => 'ផល ដាវីត (ប្រធាន STJ - មិនបង្រៀន)',
                    ],
                    'president_account' => 'e20221334 (ផល ដាវីត)',
                    'default_password' => 'password123',
                ],
                'details' => [
                    'migrate' => trim($migrateOutput),
                    'seed' => trim($seedOutput),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
