# Custom Tests for Profile Completion System

This directory contains test scripts that were used during the development and debugging of the admin profile completion system. These are not traditional PHPUnit tests but rather standalone PHP scripts that can be executed directly.

## Test Files

### Profile Completion Workflow Tests

- **`test_step_skip_workflow.php`** - Tests the complete user workflow: fill step 1 → next → step 2 → skip functionality. Validates that step 1 data is preserved when skipping step 2.

- **`test_step_navigation.php`** - Tests the step navigation logic that determines which step a user should start from based on their completion progress.

- **`test_manual_navigation.php`** - Sets up test data for manual testing of the profile completion page navigation.

- **`test_save_progress.php`** - Tests the saveProgress API endpoint functionality for incremental form data saving.

### Admin System Tests

- **`test_admin_onboarding.php`** - Tests the admin onboarding service and completion percentage calculations.

- **`test_admin_detection.php`** - Tests the admin user detection functionality and role validation.

### Utility Scripts

- **`cleanup_db.php`** - Database cleanup utility that removes all employee records and resets admin user state for clean testing.

- **`debug_step_calc.php`** - Debug script for troubleshooting step calculation logic and field validation.

## Usage

These scripts can be run directly from the command line:

```bash
php tests/Custom/test_step_skip_workflow.php
php tests/Custom/cleanup_db.php
```

## Important Notes

- These scripts bootstrap Laravel and use the actual application models and services
- Some scripts modify database data - use with caution in production
- The cleanup script will delete all employee records
- These were created for debugging specific issues during development

## Related Components

These tests work with the following system components:

- `AdminProfileController` - Handles profile completion form submission and progress
- `AdminOnboardingService` - Manages onboarding progress calculations
- `ProfileCompletion.jsx` - React component for the multi-step form
- `Employee` model - Database model for employee records
- `User` model - User model with employee relationship

## Test Scenarios Covered

1. **Step Navigation Logic** - Ensures users start from the correct step based on completion
2. **Data Persistence** - Validates that form data is saved correctly at each step
3. **Skip Functionality** - Tests that skipping preserves existing data
4. **Progress Calculation** - Verifies completion percentage calculations
5. **Admin Detection** - Tests admin user identification across the system
6. **API Endpoints** - Validates saveProgress and skip API functionality

These tests were instrumental in ensuring the profile completion system works correctly for the specific user journey: complete step 1, navigate to step 2, then skip while preserving step 1 data.