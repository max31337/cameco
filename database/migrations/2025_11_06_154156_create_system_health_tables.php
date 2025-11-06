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
        // System health logs (server resources monitoring)
        Schema::create('system_health_logs', function (Blueprint $table) {
            $table->id();
            $table->decimal('cpu_usage', 5, 2); // CPU percentage (0.00-100.00)
            $table->decimal('memory_usage', 5, 2); // Memory percentage (0.00-100.00)
            $table->decimal('disk_usage', 5, 2); // Disk percentage (0.00-100.00)
            $table->string('load_average')->nullable(); // "0.5, 0.6, 0.7"
            $table->unsignedBigInteger('uptime_seconds')->nullable(); // Server uptime
            $table->integer('database_response_ms')->nullable(); // Database response time
            $table->string('cache_status')->default('unknown'); // online, offline, degraded
            $table->integer('queue_pending')->default(0); // Pending jobs count
            $table->integer('queue_failed')->default(0); // Failed jobs count
            $table->string('overall_status')->default('healthy'); // healthy, warning, critical
            $table->timestamps();
            
            $table->index('created_at');
            $table->index('overall_status');
        });

        // System backup logs
        Schema::create('system_backup_logs', function (Blueprint $table) {
            $table->id();
            $table->string('backup_type'); // full, incremental, database, files
            $table->string('status'); // pending, in_progress, completed, failed
            $table->string('location')->nullable(); // File path or storage location
            $table->unsignedBigInteger('size_bytes')->nullable(); // Backup file size
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable(); // Additional backup details
            $table->timestamps();
            
            $table->index('status');
            $table->index(['backup_type', 'status']);
            $table->index('created_at');
        });

        // System patch approvals (internal patch management)
        Schema::create('system_patch_approvals', function (Blueprint $table) {
            $table->id();
            $table->string('patch_name');
            $table->string('patch_type'); // security, feature, bugfix, performance
            $table->string('version_from')->nullable();
            $table->string('version_to');
            $table->string('status')->default('pending'); // pending, approved, rejected, deployed, failed
            $table->text('description')->nullable();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('deployed_at')->nullable();
            $table->text('deployment_notes')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('patch_type');
            $table->index('created_at');
        });

        // Security audit logs
        Schema::create('security_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('event_type'); // login, logout, failed_login, permission_change, role_change, data_access
            $table->string('severity')->default('info'); // info, warning, critical
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->text('description');
            $table->json('metadata')->nullable(); // Additional context
            $table->timestamps();
            
            $table->index('event_type');
            $table->index('severity');
            $table->index('user_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_audit_logs');
        Schema::dropIfExists('system_patch_approvals');
        Schema::dropIfExists('system_backup_logs');
        Schema::dropIfExists('system_health_logs');
    }
};
