<?php

namespace Tests\Feature\ATS;

use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RouteResponseTest extends TestCase
{
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user with HR Manager role and ATS permissions
        $this->user = User::factory()->create();
        
        // Create HR Manager role if it doesn't exist
        $role = Role::firstOrCreate(['name' => 'HR Manager', 'guard_name' => 'web']);
        
        // Create and assign ATS permissions
        $permissions = [
            'recruitment.job_postings.view',
            'recruitment.job_postings.create',
            'recruitment.job_postings.update',
            'recruitment.job_postings.delete',
            'recruitment.candidates.view',
            'recruitment.candidates.create',
            'recruitment.candidates.update',
            'recruitment.applications.view',
            'recruitment.applications.update',
            'recruitment.interviews.view',
            'recruitment.interviews.create',
            'recruitment.interviews.update',
            'recruitment.hiring_pipeline.view',
            'recruitment.hiring_pipeline.update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign permissions to role and user
        $role->syncPermissions(Permission::whereIn('name', $permissions)->get());
        $this->user->assignRole($role);
    }

    /**
     * Test Job Postings Index route returns proper Inertia response
     */
    public function test_job_postings_index_returns_inertia_response(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('hr.ats.job-postings.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('HR/ATS/JobPostings/Index')
            ->has('job_postings')
            ->has('filters')
            ->has('breadcrumbs')
        );
    }

    /**
     * Test Candidates Index route returns proper Inertia response
     */
    public function test_candidates_index_returns_inertia_response(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('hr.ats.candidates.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('HR/ATS/Candidates/Index')
            ->has('candidates')
            ->has('filters')
            ->has('breadcrumbs')
        );
    }

    /**
     * Test Applications Index route returns proper Inertia response
     */
    public function test_applications_index_returns_inertia_response(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('hr.ats.applications.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('HR/ATS/Applications/Index')
            ->has('applications')
            ->has('filters')
            ->has('breadcrumbs')
        );
    }

    /**
     * Test Interviews Index route returns proper Inertia response
     */
    public function test_interviews_index_returns_inertia_response(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('hr.ats.interviews.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('HR/ATS/Interviews/Index')
            ->has('interviews')
            ->has('statistics')
            ->has('interviewers')
            ->has('breadcrumbs')
        );
    }

    /**
     * Test Hiring Pipeline Index route returns proper Inertia response
     */
    public function test_hiring_pipeline_index_returns_inertia_response(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('hr.ats.hiring-pipeline.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('HR/ATS/HiringPipeline/Index')
            ->has('pipeline')
            ->has('summary')
            ->has('jobPostings')
            ->has('breadcrumbs')
        );
    }

    /**
     * Test Job Postings Create route requires permission
     */
    public function test_job_postings_create_requires_permission(): void
    {
        $userWithoutPermission = User::factory()->create();

        $response = $this->actingAs($userWithoutPermission)
            ->get(route('hr.ats.job-postings.create'));

        $response->assertStatus(403);
    }

    /**
     * Test Candidates Index route requires permission
     */
    public function test_candidates_index_requires_permission(): void
    {
        $userWithoutPermission = User::factory()->create();

        $response = $this->actingAs($userWithoutPermission)
            ->get(route('hr.ats.candidates.index'));

        $response->assertStatus(403);
    }

    /**
     * Test Applications Index route requires permission
     */
    public function test_applications_index_requires_permission(): void
    {
        $userWithoutPermission = User::factory()->create();

        $response = $this->actingAs($userWithoutPermission)
            ->get(route('hr.ats.applications.index'));

        $response->assertStatus(403);
    }

    /**
     * Test Interviews Index route requires permission
     */
    public function test_interviews_index_requires_permission(): void
    {
        $userWithoutPermission = User::factory()->create();

        $response = $this->actingAs($userWithoutPermission)
            ->get(route('hr.ats.interviews.index'));

        $response->assertStatus(403);
    }

    /**
     * Test Hiring Pipeline Index route requires permission
     */
    public function test_hiring_pipeline_index_requires_permission(): void
    {
        $userWithoutPermission = User::factory()->create();

        $response = $this->actingAs($userWithoutPermission)
            ->get(route('hr.ats.hiring-pipeline.index'));

        $response->assertStatus(403);
    }

    /**
     * Test unauthenticated users are redirected to login
     */
    public function test_unauthenticated_users_redirected_to_login(): void
    {
        $response = $this->get(route('hr.ats.job-postings.index'));

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }

    /**
     * Test all routes are registered and accessible
     */
    public function test_all_ats_routes_registered(): void
    {
        $routes = [
            'hr.ats.job-postings.index',
            'hr.ats.job-postings.create',
            'hr.ats.candidates.index',
            'hr.ats.applications.index',
            'hr.ats.interviews.index',
            'hr.ats.hiring-pipeline.index',
        ];

        foreach ($routes as $routeName) {
            $this->assertNotNull(
                route($routeName),
                "Route {$routeName} is not registered"
            );
        }
    }
}
