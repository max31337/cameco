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
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('employee_number', 50)->unique();
            $table->string('lastname');
            $table->string('firstname');
            $table->string('middlename')->nullable();
            
            // Personal Information
            $table->text('address')->nullable();
            $table->string('contact_number', 50)->nullable();
            $table->string('email_personal')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('civil_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            
            // Employment Information
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->string('position')->nullable();
            $table->enum('employment_type', ['regular', 'contractual', 'probationary', 'consultant'])->nullable();
            $table->date('date_employed')->nullable();
            $table->date('date_regularized')->nullable();
            $table->unsignedBigInteger('immediate_supervisor_id')->nullable();
            
            // Government IDs
            $table->string('sss_no', 50)->unique()->nullable();
            $table->string('pagibig_no', 50)->unique()->nullable();
            $table->string('tin_no', 50)->unique()->nullable();
            $table->string('philhealth_no', 50)->unique()->nullable();
            
            // Family Information
            $table->string('spouse_name')->nullable();
            $table->date('spouse_dob')->nullable();
            $table->string('spouse_occupation')->nullable();
            $table->string('father_name')->nullable();
            $table->date('father_dob')->nullable();
            $table->string('mother_name')->nullable();
            $table->date('mother_dob')->nullable();
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->string('emergency_contact_number', 50)->nullable();
            
            // System Fields
            $table->enum('status', ['active', 'archived', 'terminated', 'on_leave', 'suspended'])->default('active');
            $table->date('termination_date')->nullable();
            $table->text('termination_reason')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['user_id']);
            $table->index(['employee_number']);
            $table->index(['department_id']);
            $table->index(['immediate_supervisor_id']);
            $table->index(['status']);
            $table->index(['employment_type']);
            
            // Foreign key for self-referencing supervisor
            $table->foreign('immediate_supervisor_id')->references('id')->on('employees')->onDelete('set null');
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
