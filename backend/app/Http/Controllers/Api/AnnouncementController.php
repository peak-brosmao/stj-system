<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AnnouncementController extends Controller
{
    /**
     * List announcements
     * GET /api/announcements
     */
    public function index()
    {
        try {
            $announcements = DB::table('announcements')
                ->where('is_published', true)
                ->orderBy('published_at', 'desc')
                ->get();

            $formatted = $announcements->map(function ($a) {
                return [
                    'id' => $a->id,
                    'titleKh' => $a->title_kh,
                    'contentKh' => $a->content_kh,
                    'scope' => $a->scope,
                    'date' => substr($a->published_at, 0, 10),
                    'published' => (bool)$a->is_published,
                ];
            });

            return response()->json([
                'success' => true,
                'announcements' => $formatted,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'announcements' => [],
            ]);
        }
    }

    /**
     * Create announcement
     * POST /api/announcements
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titleKh' => 'required|string|min:3|max:255',
            'contentKh' => 'required|string|min:5',
            'scope' => 'nullable|string',
        ]);

        $id = (string) Str::uuid();
        $now = now();

        DB::table('announcements')->insert([
            'id' => $id,
            'title_kh' => strip_tags($validated['titleKh']),
            'title_en' => strip_tags($validated['titleKh']),
            'title_fr' => strip_tags($validated['titleKh']),
            'content_kh' => strip_tags($validated['contentKh']),
            'content_en' => strip_tags($validated['contentKh']),
            'content_fr' => strip_tags($validated['contentKh']),
            'scope' => $validated['scope'] ?? 'GLOBAL',
            'is_published' => true,
            'published_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'បានរក្សាទុកសេចក្តីជូនដំណឹងចូល Database',
        ], 201);
    }
}

