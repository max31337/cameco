<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Departments table with self-referencing parent relationship
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('departments')->onDelete('restrict');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('code')->unique(); // Department code (e.g., 'HR', 'IT', 'SALES')
            $table->integer('budget')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('parent_id');
            $table->index('manager_id');
            $table->index('is_active');
        });

        // Positions/Job Titles table
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->text('description')->nullable();
            $table->foreignId('department_id')->constrained('departments')->onDelete('restrict');
            $table->foreignId('reports_to')->nullable()->constrained('positions')->onDelete('set null');
            $table->string('level'); // junior, senior, lead, manager, director, etc.
            $table->integer('min_salary')->nullable();
            $table->integer('max_salary')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('department_id');
            $table->index('reports_to');
            $table->index('level');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
        Schema::dropIfExists('departments');
    }
};
