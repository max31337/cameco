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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            
            // User and Profile relationships
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('profile_id')->constrained('profiles')->onDelete('restrict');
            $table->string('employee_number', 50)->unique();
            
            // Employment Information
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('position')->nullable();
            $table->enum('employment_type', ['regular', 'contractual', 'probationary', 'consultant'])->nullable();
            $table->date('date_employed')->nullable();
            $table->date('date_regularized')->nullable();
            $table->foreignId('immediate_supervisor_id')->nullable()->constrained('employees')->onDelete('set null');
            
            // Status and Termination
            $table->enum('status', ['active', 'archived', 'terminated', 'on_leave', 'suspended'])->default('active');
            $table->date('termination_date')->nullable();
            $table->text('termination_reason')->nullable();
            
            // Audit fields
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('user_id');
            $table->index('profile_id');
            $table->index('employee_number');
            $table->index('department_id');
            $table->index('immediate_supervisor_id');
            $table->index('status');
            $table->index('employment_type');
            $table->index('date_employed');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
