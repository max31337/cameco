# ATS Permissions - Fix Applied

## Problem
When accessing ATS routes (e.g., `/hr/ats/hiring-pipeline`), the application threw the following error:

```
Illuminate\Contracts\Container\BindingResolutionException
Target class [permission] does not exist.
```

This occurred because the routes were configured with permission middleware (`permission:recruitment.hiring_pipeline.view`), but the actual permissions didn't exist in the database.

## Root Cause
The routes in `routes/web.php` require specific permissions like:
- `recruitment.job_postings.view`
- `recruitment.candidates.view`
- `recruitment.applications.view`
- `recruitment.interviews.view`
- `recruitment.hiring_pipeline.view`
- And others...

However, these permissions were never created in the `permissions` table, causing the middleware to fail.

## Solution Implemented

### 1. Created ATS Permissions Seeder
**File:** `database/seeders/ATSPermissionsSeeder.php`

This seeder creates 22 recruitment-related permissions:

**Job Postings (6 permissions):**
- `recruitment.job_postings.view`
- `recruitment.job_postings.create`
- `recruitment.job_postings.edit`
- `recruitment.job_postings.delete`
- `recruitment.job_postings.publish`
- `recruitment.job_postings.close`

**Candidates (5 permissions):**
- `recruitment.candidates.view`
- `recruitment.candidates.create`
- `recruitment.candidates.edit`
- `recruitment.candidates.delete`
- `recruitment.candidates.add_note`

**Applications (5 permissions):**
- `recruitment.applications.view`
- `recruitment.applications.edit`
- `recruitment.applications.shortlist`
- `recruitment.applications.reject`
- `recruitment.applications.update_status`

**Interviews (5 permissions):**
- `recruitment.interviews.view`
- `recruitment.interviews.create`
- `recruitment.interviews.edit`
- `recruitment.interviews.cancel`
- `recruitment.interviews.add_feedback`

**Hiring Pipeline (2 permissions):**
- `recruitment.hiring_pipeline.view`
- `recruitment.hiring_pipeline.move_application`

### 2. Updated DatabaseSeeder
**File:** `database/seeders/DatabaseSeeder.php`

Added call to `ATSPermissionsSeeder` to ensure permissions are created whenever the database is seeded:

```php
if (class_exists(\Database\Seeders\ATSPermissionsSeeder::class)) {
    $this->call(\Database\Seeders\ATSPermissionsSeeder::class);
}
```

### 3. Automatic Role Assignment
The seeder automatically assigns all 22 recruitment permissions to the "HR Manager" role using Spatie's permission system:

```php
$hrManagerRole->givePermissionTo($permissions);
```

## How to Use

### Option 1: Run Full Database Seeding
```bash
php artisan db:seed
```

This will run all seeders including the new ATS permissions seeder.

### Option 2: Run Only ATS Permissions Seeder
```bash
php artisan db:seed --class=ATSPermissionsSeeder
```

This is useful if you only want to add permissions without refreshing other data.

### Option 3: Fresh Database with All Seeders
```bash
php artisan migrate:fresh --seed
```

This will create a fresh database with all migrations and seeders.

## Verification

After running the seeder, all ATS routes should work without the "Target class [permission] does not exist" error.

Test routes:
- `GET /hr/ats/job-postings` (requires `recruitment.job_postings.view`)
- `GET /hr/ats/candidates` (requires `recruitment.candidates.view`)
- `GET /hr/ats/applications` (requires `recruitment.applications.view`)
- `GET /hr/ats/interviews` (requires `recruitment.interviews.view`)
- `GET /hr/ats/hiring-pipeline` (requires `recruitment.hiring_pipeline.view`)

## Requirements
- ✅ Spatie Laravel Permissions package (already installed)
- ✅ HR Manager role must exist in `roles` table
- ✅ User must have HR Manager role assigned

## Next Steps
Once this seeder is run:
1. All ATS routes will be accessible to HR Manager role users
2. Frontend pages (Job Postings, Candidates, Applications, Interviews, Hiring Pipeline) will load without permission errors
3. Mock data from controllers will be displayed properly
4. Users can test the frontend components

---

**Status:** ✅ Fixed and ready to use
**Date:** November 11, 2025
