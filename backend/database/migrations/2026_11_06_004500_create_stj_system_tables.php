<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Departments
        Schema::create('departments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->string('name_kh');
            $table->string('name_en');
            $table->string('name_fr')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Academic Years
        Schema::create('academic_years', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->string('label');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Members
        Schema::create('members', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('member_id')->unique();
            $table->string('student_id')->nullable()->index();
            $table->string('full_name_kh');
            $table->string('full_name_en');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('gender')->nullable();
            $table->string('department_id');
            $table->string('academic_year_id');
            $table->string('status')->default('ACTIVE');
            $table->timestamps();

            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->cascadeOnDelete();
        });

        // 4. Update Users table for STJ
        Schema::table('users', function (Blueprint $table) {
            $table->string('student_id')->nullable()->after('email');
            $table->string('full_name_kh')->nullable()->after('name');
            $table->string('full_name_en')->nullable()->after('full_name_kh');
            $table->string('role')->default('MEMBER')->after('student_id');
            $table->string('member_id')->nullable()->after('role');
        });

        // 5. Courses
        Schema::create('courses', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->string('slug')->unique();
            $table->string('title_kh');
            $table->string('title_en');
            $table->string('department_id')->nullable();
            $table->string('academic_year')->default('2026-2027');
            $table->string('semester')->default('Semester 1');
            $table->string('status')->default('ACTIVE');
            $table->timestamps();
        });

        // 6. Course Enrollments
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->string('course_id');
            $table->string('member_id');
            $table->timestamp('enrolled_at')->useCurrent();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->unique(['course_id', 'member_id']);
        });

        // 7. Course Leaders
        Schema::create('course_leaders', function (Blueprint $table) {
            $table->id();
            $table->string('course_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('assigned_at')->useCurrent();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        // 8. Teaching Sessions (Lessons)
        Schema::create('teaching_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('course_id');
            $table->string('title');
            $table->date('session_date');
            $table->string('start_time')->default('11:30');
            $table->string('end_time')->default('13:00');
            $table->string('room')->default('SF1');
            $table->string('status')->default('SCHEDULED');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('created_by_id')->references('id')->on('users')->nullOnDelete();
        });

        // 9. Attendance Records
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('session_id');
            $table->string('member_id');
            $table->string('status')->default('PRESENT');
            $table->string('remarks')->nullable();
            $table->unsignedBigInteger('marked_by_id')->nullable();
            $table->unsignedBigInteger('last_updated_by_id')->nullable();
            $table->timestamps();

            $table->foreign('session_id')->references('id')->on('teaching_sessions')->cascadeOnDelete();
            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->foreign('marked_by_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('last_updated_by_id')->references('id')->on('users')->nullOnDelete();
            $table->unique(['session_id', 'member_id']);
        });

        // 10. Share Links
        Schema::create('share_links', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('token')->unique();
            $table->string('token_hash')->nullable();
            $table->string('course_id');
            $table->string('session_id')->nullable();
            $table->string('title');
            $table->string('password_hash')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_revoked')->default(false);
            $table->integer('access_count')->default(0);
            $table->boolean('show_stats')->default(true);
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('session_id')->references('id')->on('teaching_sessions')->nullOnDelete();
            $table->foreign('created_by_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('share_links');
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('teaching_sessions');
        Schema::dropIfExists('course_leaders');
        Schema::dropIfExists('course_enrollments');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('members');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('departments');
    }
};
