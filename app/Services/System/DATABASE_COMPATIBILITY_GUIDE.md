# Database Compatibility Guide

## Overview

The `DatabaseCompatibilityService` provides a centralized way to handle database-specific SQL functions across different database systems (SQLite, MySQL, PostgreSQL).

This ensures your application works seamlessly when switching between databases without code changes.

## Supported Databases

- **SQLite** (`sqlite`) - SQLite 3
- **MySQL** (`mysql`) - MySQL 5.7+, MySQL 8.0+
- **MariaDB** (`mariadb`) - MariaDB 10+
- **PostgreSQL** (`pgsql`) - PostgreSQL 10+

## Key Methods

### Date/Time Extraction

#### Extract Day of Week
```php
// Returns: 0-6 (Sunday=0, Saturday=6)
DB::raw(DatabaseCompatibilityService::extractDayOfWeek('created_at'))

// Example usage in query
->selectRaw(DatabaseCompatibilityService::extractDayOfWeek('created_at') . ' as day_of_week')
```

#### Extract Hour
```php
// Returns: 0-23
DB::raw(DatabaseCompatibilityService::extractHour('created_at'))

// Example
->selectRaw(DatabaseCompatibilityService::extractHour('created_at') . ' as hour')
```

#### Extract Month/Year/Day/Week
```php
->selectRaw(DatabaseCompatibilityService::extractMonth('created_at') . ' as month')
->selectRaw(DatabaseCompatibilityService::extractYear('created_at') . ' as year')
->selectRaw(DatabaseCompatibilityService::extractDay('created_at') . ' as day')
->selectRaw(DatabaseCompatibilityService::extractWeek('created_at') . ' as week')
```

#### Extract Date Only
```php
// Returns: DATE type
DB::raw(DatabaseCompatibilityService::extractDate('created_at'))
```

### Date/Time Formatting

#### Format Date (YYYY-MM-DD)
```php
->selectRaw(DatabaseCompatibilityService::formatDate('created_at') . ' as formatted_date')
```

#### Format DateTime (YYYY-MM-DD HH:MM:SS)
```php
->selectRaw(DatabaseCompatibilityService::formatDateTime('created_at') . ' as formatted_datetime')
```

### Date/Time Calculations

#### Date Difference in Days
```php
// Returns: INTEGER (number of days)
->selectRaw(DatabaseCompatibilityService::dateDiffInDays('start_date', 'end_date') . ' as days_elapsed')
```

#### Date Difference in Seconds/Minutes/Hours
```php
->selectRaw(DatabaseCompatibilityService::dateDiffInSeconds('start_at', 'end_at') . ' as seconds')
->selectRaw(DatabaseCompatibilityService::dateDiffInMinutes('start_at', 'end_at') . ' as minutes')
->selectRaw(DatabaseCompatibilityService::dateDiffInHours('start_at', 'end_at') . ' as hours')
```

#### Add/Subtract Days from Date
```php
// Add 7 days to a date
->whereRaw(DatabaseCompatibilityService::addDays('created_at', 7) . ' > ?', [now()])

// Subtract 30 days
->whereRaw(DatabaseCompatibilityService::subtractDays('created_at', 30) . ' < ?', [now()])
```

#### Add Hours to Timestamp
```php
->whereRaw(DatabaseCompatibilityService::addHours('created_at', 24) . ' > ?', [now()])
```

### Type Casting

#### Cast to Integer
```php
->selectRaw(DatabaseCompatibilityService::castToInt('status') . ' as status_int')
```

#### Cast to String
```php
->selectRaw(DatabaseCompatibilityService::castToString('user_id') . ' as user_id_str')
```

#### Cast to Decimal
```php
// Cast to DECIMAL(10, 2)
->selectRaw(DatabaseCompatibilityService::castToDecimal('amount', 10, 2) . ' as amount_decimal')
```

### JSON Operations

#### Extract JSON Value
```php
// Get a specific key from JSON column
->selectRaw(DatabaseCompatibilityService::jsonExtract('metadata', 'error_type') . ' as error_type')
```

#### Extract JSON Value as Integer
```php
->selectRaw(DatabaseCompatibilityService::jsonExtractInt('metadata', 'employee_count') . ' as emp_count')
```

### Other Utilities

#### Coalesce (First Non-Null)
```php
->selectRaw(DatabaseCompatibilityService::coalesce(['column1', 'column2', "'default_value'"]) . ' as result')
```

#### Current Timestamp
```php
// Insert current time
'created_at' => DB::raw(DatabaseCompatibilityService::now())
```

#### Current Date
```php
'date_column' => DB::raw(DatabaseCompatibilityService::today())
```

#### Truncate Time (Date Only)
```php
->selectRaw(DatabaseCompatibilityService::truncateTime('created_at') . ' as date_only')
```

## Real-World Examples

### Example 1: User Activity Heatmap

```php
// Get activity by day of week and hour
$activities = DB::table('audit_logs')
    ->whereBetween('created_at', [$from, $to])
    ->selectRaw(DatabaseCompatibilityService::extractDayOfWeek('created_at') . ' as day_of_week')
    ->selectRaw(DatabaseCompatibilityService::extractHour('created_at') . ' as hour')
    ->selectRaw('COUNT(*) as count')
    ->groupBy('day_of_week', 'hour')
    ->get();
```

### Example 2: Session Duration Statistics

```php
// Calculate session duration in minutes
$sessions = DB::table('logs')
    ->selectRaw('user_id')
    ->selectRaw(DatabaseCompatibilityService::dateDiffInMinutes('login_time', 'logout_time') . ' as duration_minutes')
    ->selectRaw(DatabaseCompatibilityService::formatDateTime('login_time') . ' as login_formatted')
    ->where('event', 'logout')
    ->get();
```

### Example 3: Activity by Module (Last 30 Days)

```php
// Activities from the last 30 days
$activities = DB::table('audit_logs')
    ->whereRaw(DatabaseCompatibilityService::subtractDays('created_at', 30) . ' < ' . DatabaseCompatibilityService::today())
    ->selectRaw('module')
    ->selectRaw('COUNT(*) as access_count')
    ->groupBy('module')
    ->orderByDesc('access_count')
    ->get();
```

### Example 4: Payroll Processing Time Analysis

```php
// Calculate average processing time for payroll jobs
$payrollStats = DB::table('payroll_jobs')
    ->selectRaw('payroll_period')
    ->selectRaw(DatabaseCompatibilityService::dateDiffInSeconds('started_at', 'completed_at') . ' as processing_seconds')
    ->selectRaw('COUNT(*) as total_runs')
    ->where('status', 'completed')
    ->whereBetween('created_at', [$from, $to])
    ->groupBy('payroll_period')
    ->get()
    ->map(function ($row) {
        return [
            'period' => $row->payroll_period,
            'avg_processing_seconds' => round($row->processing_seconds / $row->total_runs),
            'total_runs' => $row->total_runs,
        ];
    });
```

### Example 5: Compliance Report with JSON Metadata

```php
// Get compliance violations with error details from JSON
$violations = DB::table('compliance_logs')
    ->selectRaw('id')
    ->selectRaw(DatabaseCompatibilityService::jsonExtract('metadata', 'violation_type') . ' as violation_type')
    ->selectRaw(DatabaseCompatibilityService::jsonExtractInt('metadata', 'violation_count') . ' as count')
    ->selectRaw(DatabaseCompatibilityService::formatDate('created_at') . ' as violation_date')
    ->where('severity', 'critical')
    ->whereBetween('created_at', [$from, $to])
    ->get();
```

## Migration from SQLite to PostgreSQL

### Before (SQLite-specific)
```php
->selectRaw("CAST(strftime('%H', created_at) AS INTEGER) as hour")
->selectRaw("CAST(strftime('%w', created_at) AS INTEGER) as day_of_week")
```

### After (Database-agnostic)
```php
->selectRaw(DatabaseCompatibilityService::extractHour('created_at') . ' as hour')
->selectRaw(DatabaseCompatibilityService::extractDayOfWeek('created_at') . ' as day_of_week')
```

### Configuration Changes
Update your `.env` file:

```env
# SQLite
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=cameco_prod
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
```

Then run migrations:
```bash
php artisan migrate
php artisan db:seed
```

## Best Practices

1. **Always use the compatibility service** for database-specific SQL functions
2. **Avoid raw SQL** when Eloquent can do the job
3. **Use Eloquent relationships** instead of JOINs where possible
4. **Test queries on target database** before deployment
5. **Document any database-specific requirements** in comments
6. **Use Laravel migrations** for all schema changes (they're database-agnostic)

## Troubleshooting

### Query returns NULL
- Verify the column name is correct
- Check data types match expectations
- Ensure date columns are TIMESTAMP/DATETIME types

### Performance Issues
- Add indexes to frequently queried columns
- Use EXPLAIN to analyze query plans
- Consider materializing views for complex queries

### Type Mismatch Errors
- Use explicit casting with `castToInt()`, `castToString()`, etc.
- Verify JSON extraction uses correct key paths
- Check NULL handling with `coalesce()`

## Support Matrix

| Feature | SQLite | MySQL | PostgreSQL |
|---------|--------|-------|------------|
| Date Extraction | ✅ | ✅ | ✅ |
| Date Formatting | ✅ | ✅ | ✅ |
| Date Calculations | ✅ | ✅ | ✅ |
| Type Casting | ✅ | ✅ | ✅ |
| JSON Operations | ✅ | ✅ | ✅ |
| Transactions | ✅ | ✅ | ✅ |
| Full-Text Search | ⚠️ | ✅ | ✅ |

⚠️ = Limited support or requires additional setup

## Contributing

When adding new database-specific functions:

1. Add the method to `DatabaseCompatibilityService`
2. Implement for all 4 drivers
3. Add examples to this guide
4. Update the support matrix
5. Test on all supported databases
