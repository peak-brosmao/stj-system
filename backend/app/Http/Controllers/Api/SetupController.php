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
            Artisan::call('migrate', ['--force' => true]);
            $migrateOutput = Artisan::output();

            Artisan::call('db:seed', ['--class' => 'StjDatabaseSeeder', '--force' => true]);
            $seedOutput = Artisan::output();

            $memberCount = DB::table('members')->count();
            $courseCount = DB::table('courses')->count();
            $userCount = DB::table('users')->count();

            return response()->json([
                'success' => true,
                'message' => 'STJ Database Migration & Seeding ជោគជ័យ ១០០%!',
                'summary' => [
                    'members_seeded' => $memberCount,
                    'courses_seeded' => $courseCount,
                    'users_seeded' => $userCount,
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
