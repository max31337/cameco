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
        // Incidents Table - Track support tickets/incidents
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('severity', ['critical', 'major', 'minor'])->default('minor');
            $table->enum('status', ['open', 'investigating', 'resolved', 'closed'])->default('open');
            $table->foreignId('reported_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('detected_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamp('investigating_started_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->json('metadata')->nullable(); // Additional incident context
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index(['severity', 'status']);
            $table->index('detected_at');
            $table->index('assigned_to');
        });

        // Application Uptime Logs Table - Track uptime/availability of application services
        Schema::create('application_uptime_logs', function (Blueprint $table) {
            $table->id();
            $table->timestamp('checked_at');
            $table->boolean('is_healthy')->default(true);
            $table->integer('response_time_ms')->nullable(); // Response time in milliseconds
            $table->string('check_type')->default('automated'); // automated, manual, scheduled
            $table->text('failure_reason')->nullable();
            $table->json('metrics')->nullable(); // CPU, RAM, disk, etc.
            $table->timestamps();

            // Indexes
            $table->index('checked_at');
            $table->index(['is_healthy', 'checked_at']);
        });

        // Patches Table - Track patches/updates
        Schema::create('patches', function (Blueprint $table) {
            $table->id();
            $table->string('version'); // e.g., 1.2.3
            $table->string('patch_number')->nullable(); // e.g., PATCH-2024-001
            $table->enum('type', ['security', 'feature', 'bugfix', 'maintenance'])->default('bugfix');
            $table->enum('status', ['pending', 'scheduled', 'deployed', 'failed', 'rolled_back'])->default('pending');
            $table->text('description')->nullable();
            $table->text('release_notes')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('deployed_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('rolled_back_at')->nullable();
            $table->foreignId('deployed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('deployment_notes')->nullable();
            $table->json('affected_components')->nullable(); // List of affected modules/services
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('status');
            $table->index('deployed_at');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patches');
        Schema::dropIfExists('application_uptime_logs');
        Schema::dropIfExists('incidents');
    }
};
