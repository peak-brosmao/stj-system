<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    /**
     * List active departments
     * GET /api/departments
     */
    public function index()
    {
        try {
            $departments = DB::table('departments')
                ->where('is_active', true)
                ->orderBy('code', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'departments' => $departments,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'departments' => [],
            ]);
        }
    }
}

