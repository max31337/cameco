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
        Schema::create('scheduled_jobs', function (Blueprint $table) {
            $table->id();
            
            // Job identification
            $table->string('name')->unique()->comment('Human-readable job name');
            $table->text('description')->nullable()->comment('Job description/purpose');
            $table->string('command')->comment('Laravel Artisan command signature');
            
            // Scheduling configuration
            $table->string('cron_expression', 100)->comment('Cron expression (e.g., "0 0 * * *")');
            $table->boolean('is_enabled')->default(true)->comment('Whether job is active');
            
            // Execution tracking
            $table->timestamp('last_run_at')->nullable()->comment('Last execution timestamp');
            $table->timestamp('next_run_at')->nullable()->comment('Calculated next run time');
            $table->integer('last_exit_code')->nullable()->comment('Exit code from last run (0 = success)');
            $table->text('last_output')->nullable()->comment('Output/logs from last execution');
            
            // Statistics
            $table->unsignedInteger('run_count')->default(0)->comment('Total executions');
            $table->unsignedInteger('success_count')->default(0)->comment('Successful executions');
            $table->unsignedInteger('failure_count')->default(0)->comment('Failed executions');
            
            // Audit trail
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->comment('User who created the job');
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->comment('User who last updated the job');
            
            // Timestamps & soft deletes
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index('is_enabled');
            $table->index('next_run_at');
            $table->index('command');
            $table->index(['is_enabled', 'next_run_at'], 'enabled_next_run_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scheduled_jobs');
    }
};
