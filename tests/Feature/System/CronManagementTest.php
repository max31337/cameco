<?php

namespace Tests\Feature\System;

use App\Models\ScheduledJob;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CronManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        Role::create(['name' => 'superadmin', 'guard_name' => 'web']);
        Role::create(['name' => 'user', 'guard_name' => 'web']);

        // Create superadmin user
        $this->superAdmin = User::factory()->create(['email' => 'superadmin@cameco.com']);
        $this->superAdmin->assignRole('superadmin');

        // Create regular user
        $this->regularUser = User::factory()->create(['email' => 'user@cameco.com']);
        $this->regularUser->assignRole('user');
    }

    /**
     * TEST 5b.12.1: Index Page Display
     * Verify the Cron management page displays correctly with all required sections
     */
    public function test_cron_index_page_displays_correctly(): void
    {
        // Create sample scheduled jobs
        $job1 = ScheduledJob::factory()->create([
            'name' => 'Daily Cache Clear',
            'command' => 'cache:clear',
            'cron_expression' => '0 0 * * *',
            'is_enabled' => true,
            'run_count' => 30,
            'success_count' => 28,
            'failure_count' => 2,
        ]);

        $job2 = ScheduledJob::factory()->create([
            'name' => 'Weekly Database Backup',
            'command' => 'backup:run',
            'cron_expression' => '0 2 * * 0',
            'is_enabled' => true,
            'run_count' => 5,
            'success_count' => 5,
            'failure_count' => 0,
        ]);

        // Access as superadmin
        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('System/Cron')
            ->has('jobs.data', 2)
            ->has('metrics')
            ->has('availableCommands')
            ->has('filters')
        );
    }

    /**
     * TEST 5b.12.2: Non-Superadmin Access Control
     * Verify regular users cannot access cron management page
     */
    public function test_regular_user_cannot_access_cron_page(): void
    {
        $response = $this->actingAs($this->regularUser)->get('/system/cron');

        // Should be redirected or get 403
        $response->assertStatus(403);
    }

    /**
     * TEST 5b.12.3: Unauthenticated Access
     * Verify unauthenticated users are redirected to login
     */
    public function test_unauthenticated_user_redirected_to_login(): void
    {
        $response = $this->get('/system/cron');

        $response->assertRedirect('/login');
    }

    /**
     * TEST 5b.12.4: Metrics Display
     * Verify job metrics are correctly calculated and displayed
     */
    public function test_cron_metrics_display_correctly(): void
    {
        // Create mixed jobs
        ScheduledJob::factory()->create(['is_enabled' => true]); // Job 1 - enabled
        ScheduledJob::factory()->create(['is_enabled' => true]); // Job 2 - enabled
        ScheduledJob::factory()->create(['is_enabled' => false]); // Job 3 - disabled

        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertInertia(fn ($page) => $page
            ->where('metrics.total_jobs', 3)
            ->where('metrics.enabled_jobs', 2)
            ->where('metrics.disabled_jobs', 1)
        );
    }

    /**
     * TEST 5b.12.5: Filter by Status
     * Verify filtering by job status (active, disabled, overdue, failed)
     */
    public function test_filter_by_status(): void
    {
        $enabledJob = ScheduledJob::factory()->create([
            'is_enabled' => true,
            'last_exit_code' => 0,
        ]);

        $disabledJob = ScheduledJob::factory()->create([
            'is_enabled' => false,
        ]);

        // Filter by active status
        $response = $this->actingAs($this->superAdmin)->get('/system/cron?status=active');
        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 1)
        );
    }

    /**
     * TEST 5b.12.6: Filter by Enabled Status
     * Verify filtering by enabled/disabled status
     */
    public function test_filter_by_enabled_status(): void
    {
        ScheduledJob::factory()->create(['is_enabled' => true]);
        ScheduledJob::factory()->create(['is_enabled' => true]);
        ScheduledJob::factory()->create(['is_enabled' => false]);

        // Filter enabled only
        $response = $this->actingAs($this->superAdmin)->get('/system/cron?is_enabled=1');
        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 2)
        );

        // Filter disabled only
        $response = $this->actingAs($this->superAdmin)->get('/system/cron?is_enabled=0');
        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 1)
        );
    }

    /**
     * TEST 5b.12.7: Search Functionality
     * Verify searching by name, command, or description
     */
    public function test_search_jobs(): void
    {
        ScheduledJob::factory()->create([
            'name' => 'Daily Cache Clear',
            'command' => 'cache:clear',
        ]);

        ScheduledJob::factory()->create([
            'name' => 'Weekly Backup',
            'command' => 'backup:run',
        ]);

        // Search by name
        $response = $this->actingAs($this->superAdmin)->get('/system/cron?search=Cache');
        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 1)
        );

        // Search by command
        $response = $this->actingAs($this->superAdmin)->get('/system/cron?search=backup');
        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 1)
        );
    }

    /**
     * TEST 5b.12.8: Job Attributes Display
     * Verify all required job attributes are present (formatted_next_run, success_rate, etc.)
     */
    public function test_job_attributes_display(): void
    {
        $job = ScheduledJob::factory()->create([
            'name' => 'Test Job',
            'command' => 'test:command',
            'cron_expression' => '0 0 * * *',
            'run_count' => 100,
            'success_count' => 95,
            'failure_count' => 5,
        ]);

        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data.0', fn ($page) => $page
                ->where('id', $job->id)
                ->where('name', 'Test Job')
                ->where('command', 'test:command')
                ->where('cron_expression', '0 0 * * *')
                ->where('success_rate', 95.0)
                ->where('status', 'active')
                ->has('formatted_next_run')
                ->has('cron_description')
            )
        );
    }

    /**
     * TEST 5b.12.9: Create Job - Store Action
     * Verify creating a new scheduled job via POST /system/cron
     */
    public function test_create_scheduled_job(): void
    {
        $jobData = [
            'name' => 'New Scheduled Job',
            'description' => 'This is a test job',
            'command' => 'cache:clear',
            'cron_expression' => '0 2 * * *',
            'is_enabled' => true,
        ];

        $response = $this->actingAs($this->superAdmin)->post('/system/cron', $jobData);

        $response->assertRedirect('/system/cron');
        $this->assertDatabaseHas('scheduled_jobs', [
            'name' => 'New Scheduled Job',
            'command' => 'cache:clear',
            'cron_expression' => '0 2 * * *',
            'is_enabled' => true,
        ]);
    }

    /**
     * TEST 5b.12.10: Create Job - Validation
     * Verify validation rules on job creation
     */
    public function test_create_job_validation(): void
    {
        // Missing required fields
        $response = $this->actingAs($this->superAdmin)->post('/system/cron', []);

        $response->assertSessionHasErrors(['name', 'command', 'cron_expression']);
    }

    /**
     * TEST 5b.12.11: Create Job - Invalid Cron Expression
     * Verify validation of cron expression syntax
     */
    public function test_create_job_invalid_cron_expression(): void
    {
        $response = $this->actingAs($this->superAdmin)->post('/system/cron', [
            'name' => 'Invalid Cron Job',
            'command' => 'cache:clear',
            'cron_expression' => 'invalid cron',
            'is_enabled' => true,
        ]);

        $response->assertSessionHasErrors('cron_expression');
    }

    /**
     * TEST 5b.12.12: Update Job
     * Verify updating an existing scheduled job via PUT /system/cron/{id}
     */
    public function test_update_scheduled_job(): void
    {
        $job = ScheduledJob::factory()->create([
            'name' => 'Original Job',
            'cron_expression' => '0 0 * * *',
        ]);

        $response = $this->actingAs($this->superAdmin)->put("/system/cron/{$job->id}", [
            'name' => 'Updated Job',
            'description' => 'Updated description',
            'command' => 'cache:clear',
            'cron_expression' => '0 2 * * *',
            'is_enabled' => true,
        ]);

        $response->assertRedirect('/system/cron');
        $this->assertDatabaseHas('scheduled_jobs', [
            'id' => $job->id,
            'name' => 'Updated Job',
            'cron_expression' => '0 2 * * *',
        ]);
    }

    /**
     * TEST 5b.12.13: Toggle Job Enabled Status
     * Verify toggling job enable/disable status via POST /system/cron/{id}/toggle
     */
    public function test_toggle_job_enabled_status(): void
    {
        $job = ScheduledJob::factory()->create(['is_enabled' => true]);

        // Toggle to disabled
        $response = $this->actingAs($this->superAdmin)->post("/system/cron/{$job->id}/toggle");

        $response->assertRedirect('/system/cron');
        $this->assertDatabaseHas('scheduled_jobs', [
            'id' => $job->id,
            'is_enabled' => false,
        ]);

        // Toggle back to enabled
        $response = $this->actingAs($this->superAdmin)->post("/system/cron/{$job->id}/toggle");

        $this->assertDatabaseHas('scheduled_jobs', [
            'id' => $job->id,
            'is_enabled' => true,
        ]);
    }

    /**
     * TEST 5b.12.14: Run Job Manually
     * Verify manually executing a job via POST /system/cron/{id}/run
     */
    public function test_run_job_manually(): void
    {
        $job = ScheduledJob::factory()->create([
            'command' => 'cache:clear',
            'is_enabled' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)->post("/system/cron/{$job->id}/run");

        $response->assertRedirect('/system/cron');

        // Job should have updated last_run_at
        $job->refresh();
        $this->assertNotNull($job->last_run_at);
    }

    /**
     * TEST 5b.12.15: Delete Job
     * Verify deleting a job via DELETE /system/cron/{id}
     */
    public function test_delete_scheduled_job(): void
    {
        $job = ScheduledJob::factory()->create([
            'name' => 'Job to Delete',
        ]);

        $response = $this->actingAs($this->superAdmin)->delete("/system/cron/{$job->id}");

        $response->assertRedirect('/system/cron');

        // Job should be soft deleted
        $this->assertSoftDeleted('scheduled_jobs', ['id' => $job->id]);
    }

    /**
     * TEST 5b.12.16: Get Execution History
     * Verify retrieving job execution history via GET /system/cron/{id}/history
     */
    public function test_get_job_execution_history(): void
    {
        $job = ScheduledJob::factory()->create([
            'run_count' => 5,
            'success_count' => 4,
            'failure_count' => 1,
        ]);

        $response = $this->actingAs($this->superAdmin)->get("/system/cron/{$job->id}/history");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'history',
            'metrics' => [
                'total_runs',
                'success_rate',
                'last_run_time',
            ],
        ]);
    }

    /**
     * TEST 5b.12.17: Sync Jobs from Laravel Schedule
     * Verify syncing jobs from Laravel Schedule via POST /system/cron/sync
     */
    public function test_sync_jobs_from_schedule(): void
    {
        $response = $this->actingAs($this->superAdmin)->post('/system/cron/sync');

        $response->assertRedirect('/system/cron');
        $response->assertSessionHas('success');
    }

    /**
     * TEST 5b.12.18: Pagination
     * Verify pagination works with multiple jobs
     */
    public function test_cron_pagination(): void
    {
        // Create 20 jobs (more than default per_page of 15)
        ScheduledJob::factory()->count(20)->create();

        // First page
        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 15)
            ->where('jobs.current_page', 1)
            ->where('jobs.last_page', 2)
            ->where('jobs.total', 20)
        );

        // Second page
        $response = $this->actingAs($this->superAdmin)->get('/system/cron?page=2');

        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 5)
            ->where('jobs.current_page', 2)
        );
    }

    /**
     * TEST 5b.12.19: Available Commands List
     * Verify available Artisan commands are provided
     */
    public function test_available_commands_provided(): void
    {
        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertInertia(fn ($page) => $page
            ->has('availableCommands', fn ($page) => $page->each(
                fn ($page) => $page
                    ->has('name')
                    ->has('description')
            ))
        );
    }

    /**
     * TEST 5b.12.20: Job Status Indicators
     * Verify correct status display based on job state
     */
    public function test_job_status_indicators(): void
    {
        $activeJob = ScheduledJob::factory()->create([
            'is_enabled' => true,
            'last_exit_code' => 0,
            'next_run_at' => now()->addHours(1),
        ]);

        $disabledJob = ScheduledJob::factory()->create([
            'is_enabled' => false,
        ]);

        $failedJob = ScheduledJob::factory()->create([
            'is_enabled' => true,
            'last_exit_code' => 1,
        ]);

        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data', 3)
        );

        // Verify status attribute is set correctly
        $jobs = collect($response['props']['jobs']['data']);
        $this->assertEquals('active', $jobs->firstWhere('id', $activeJob->id)['status']);
        $this->assertEquals('disabled', $jobs->firstWhere('id', $disabledJob->id)['status']);
        $this->assertEquals('failed', $jobs->firstWhere('id', $failedJob->id)['status']);
    }

    /**
     * TEST 5b.12.21: Success Rate Calculation
     * Verify success rate is correctly calculated
     */
    public function test_success_rate_calculation(): void
    {
        $job = ScheduledJob::factory()->create([
            'run_count' => 10,
            'success_count' => 8,
            'failure_count' => 2,
        ]);

        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data.0', fn ($page) => $page
                ->where('success_rate', 80.0)
            )
        );
    }

    /**
     * TEST 5b.12.22: Cron Expression Description
     * Verify human-readable descriptions for common cron expressions
     */
    public function test_cron_expression_description(): void
    {
        ScheduledJob::factory()->create([
            'cron_expression' => '0 0 * * *',
        ]);

        $response = $this->actingAs($this->superAdmin)->get('/system/cron');

        $response->assertInertia(fn ($page) => $page
            ->has('jobs.data.0', fn ($page) => $page
                ->where('cron_description', 'Daily at midnight')
            )
        );
    }

    /**
     * TEST 5b.12.23: Form Validation - Unique Job Name
     * Verify job names must be unique
     */
    public function test_job_name_must_be_unique(): void
    {
        ScheduledJob::factory()->create(['name' => 'Duplicate Job']);

        $response = $this->actingAs($this->superAdmin)->post('/system/cron', [
            'name' => 'Duplicate Job',
            'command' => 'cache:clear',
            'cron_expression' => '0 0 * * *',
            'is_enabled' => true,
        ]);

        $response->assertSessionHasErrors('name');
    }

    /**
     * TEST 5b.12.24: Audit Logging - Job Creation
     * Verify creation is logged to security audit logs
     */
    public function test_job_creation_is_logged(): void
    {
        $this->actingAs($this->superAdmin)->post('/system/cron', [
            'name' => 'New Job for Audit',
            'command' => 'cache:clear',
            'cron_expression' => '0 0 * * *',
            'is_enabled' => true,
        ]);

        // Check that audit log was created
        $this->assertDatabaseHas('security_audit_logs', [
            'user_id' => $this->superAdmin->id,
            'event_type' => 'cron_job_created',
        ]);
    }

    /**
     * TEST 5b.12.25: Non-Superadmin Cannot Create Jobs
     * Verify regular users cannot create jobs
     */
    public function test_regular_user_cannot_create_job(): void
    {
        $response = $this->actingAs($this->regularUser)->post('/system/cron', [
            'name' => 'Unauthorized Job',
            'command' => 'cache:clear',
            'cron_expression' => '0 0 * * *',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('scheduled_jobs', [
            'name' => 'Unauthorized Job',
        ]);
    }
}
