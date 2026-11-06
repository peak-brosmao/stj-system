<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AcademicYearController extends Controller
{
    /**
     * List active academic years
     * GET /api/academic-years
     */
    public function index()
    {
        try {
            $academicYears = DB::table('academic_years')
                ->where('is_active', true)
                ->orderBy('order', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'academicYears' => $academicYears,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'academicYears' => [],
            ]);
        }
    }
}
