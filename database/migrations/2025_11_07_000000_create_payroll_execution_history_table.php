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
        Schema::create('payroll_execution_histories', function (Blueprint $table) {
            $table->id();
            
            // Job identification
            $table->string('job_type')->comment('Type of payroll job (e.g., payroll_generation, payment_batch)');
            $table->string('status')->comment('Job status: pending, processing, completed, failed');
            
            // Execution tracking
            $table->timestamp('executed_at')->comment('When the job started');
            $table->timestamp('completed_at')->nullable()->comment('When the job completed');
            
            // Job metadata
            $table->json('metadata')->nullable()->comment('Job-specific metadata (employees_processed, total_amount, error details, etc.)');
            
            // Audit trail
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index('job_type');
            $table->index('status');
            $table->index('executed_at');
            $table->index(['job_type', 'status']);
            $table->index(['executed_at', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_execution_histories');
    }
};
