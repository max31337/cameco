# System Health Monitoring

## Overview
The System Health Monitoring module provides real-time monitoring of critical system resources and services for on-premise HRIS deployments. This module is exclusively accessible to Superadmins and provides comprehensive insights into server health, database performance, queue status, storage utilization, and scheduled task management.

## Features

### 1. Server Metrics
- **CPU Usage**: Real-time CPU utilization percentage
- **Memory Usage**: RAM consumption and available memory
- **Load Average**: System load over 1, 5, and 15-minute intervals
- **Uptime**: Server uptime duration

### 2. Database Monitoring
- **Connection Status**: Active database connection health
- **Response Time**: Query execution performance in milliseconds
- **Connection Pool**: Active/idle connections
- **Query Performance**: Average query execution time

### 3. Queue Status
- **Pending Jobs**: Number of jobs waiting for processing
- **Failed Jobs**: Count of jobs that encountered errors
- **Active Workers**: Currently running queue workers
- **Processing Rate**: Jobs processed per minute

### 4. Cache Performance
- **Cache Driver**: Active cache driver (Redis, Memcached, File, etc.)
- **Hit Rate**: Cache hit percentage
- **Memory Usage**: Cache memory consumption
- **Connection Status**: Cache service availability

### 5. Storage Metrics
- **Disk Usage**: Total and used disk space
- **Usage Percentage**: Visual progress indicator
- **Available Space**: Free disk space remaining
- **Critical Threshold**: Warnings at 80%, Critical at 90%

### 6. Scheduled Tasks (Cron Jobs)
- **Job Listing**: All configured scheduled tasks
- **Execution Status**: Last run time, next scheduled run
- **Exit Codes**: Success/failure status of last execution
- **Manual Triggers**: Ability to run jobs on-demand
- **Job Management**: Create, update, and manage cron entries

## Architecture

### Service Layer
```
SystemHealthService
├── getHealthMetrics() - Aggregate all health data
├── getServerMetrics() - CPU, RAM, load average
├── getDatabaseMetrics() - Connection, response time
├── getQueueMetrics() - Jobs, workers, rates
├── getCacheMetrics() - Hit rate, memory, status
└── getStorageMetrics() - Disk usage, free space
```

### API Endpoints
```
GET  /system/health        - Fetch all health metrics (JSON)
POST /system/health/refresh - Force cache refresh
```

### Data Flow
1. **Dashboard Request** → Controller injects SystemHealthService
2. **Service Layer** → Aggregates metrics from system utilities
3. **Caching** → Metrics cached for 10 seconds to prevent spam
4. **Response** → JSON data passed to frontend widgets
5. **Auto-refresh** → Frontend polls every 30 seconds (optional)

## Implementation Details

### Server Metrics Collection
Uses PHP's `sys_getloadavg()` and `shell_exec()` commands:
- **CPU**: `top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}'`
- **Memory**: `free -m` command parsed for total/used/free
- **Uptime**: `uptime -p` command

### Database Metrics
- Connection test via `DB::connection()->getPdo()`
- Response time measured with microtime before/after simple query
- Connection pool stats from `DB::getConnections()`

### Queue Metrics
- Pending jobs: `DB::table('jobs')->count()`
- Failed jobs: `DB::table('failed_jobs')->count()`
- Workers: Check supervisor/horizon status

### Cache Metrics
- Hit rate: Ratio of cache hits to total requests
- Driver: `config('cache.default')`
- Test connection with cache get/put operations

### Storage Metrics
- Disk usage: `disk_total_space()` and `disk_free_space()`
- Calculate percentage and free space
- Check multiple mount points if configured

## Dashboard Widgets

### Health Status Cards
Each metric category displays as a card with:
- **Header**: Service name and status badge
- **Metrics**: Key performance indicators
- **Status Indicator**: Color-coded (Green/Yellow/Red)
- **Refresh Button**: Manual refresh trigger
- **Timestamp**: Last updated time

### Status Color Coding
- **Green**: Healthy (CPU < 70%, Disk < 80%, All services online)
- **Yellow**: Warning (CPU 70-85%, Disk 80-90%, Slow response)
- **Red**: Critical (CPU > 85%, Disk > 90%, Service offline)

### Auto-refresh Behavior
- Default: Manual refresh only
- Optional: Enable 30-second auto-refresh
- Pause auto-refresh when tab inactive
- Show loading spinner during refresh

## Security Considerations

### Access Control
- **Role Required**: Superadmin only
- **Middleware**: `EnsureSuperadmin` on all routes
- **Permission**: `system.health.view`

### Rate Limiting
- API endpoints throttled to 60 requests/minute
- Cache prevents database spam (10-second TTL)
- Manual refresh has 5-second cooldown

### Audit Logging
All health monitoring actions logged:
- Health metric refreshes
- Manual job triggers
- Configuration changes
- Threshold alerts

## Error Handling

### Graceful Degradation
If a metric source fails:
- Display "Unavailable" instead of error
- Log error to system logs
- Continue showing other metrics
- Retry on next refresh

### Common Errors
- **Database Connection Failed**: Show "Database Offline"
- **Cache Unavailable**: Show "Cache Driver Offline"
- **Disk Read Error**: Show "Storage Metrics Unavailable"
- **Command Execution Failed**: Fallback to PHP-only metrics

## Performance Optimization

### Caching Strategy
- All metrics cached for 10 seconds
- Cache key: `system_health_metrics`
- Separate cache for each metric category
- Manual refresh clears cache

### Async Loading
- Dashboard loads with placeholder
- Metrics fetched via API call
- Individual widgets load independently
- Failed metrics don't block others

## Usage Examples

### Superadmin Dashboard
```typescript
// Fetch health metrics
const { data } = usePage().props;
const health = data.systemHealth;

// Display server status
<ServerHealthCard 
  cpu={health.server.cpu}
  memory={health.server.memory}
  uptime={health.server.uptime}
/>
```

### API Usage
```php
// In DashboardController
use App\Services\System\SystemHealthService;

public function __construct(
    protected SystemHealthService $healthService
) {}

public function index(Request $request)
{
    $systemHealth = $this->healthService->getHealthMetrics();
    
    return Inertia::render('System/Dashboard', [
        'systemHealth' => $systemHealth,
    ]);
}
```

### Manual Refresh
```typescript
const refreshHealth = async () => {
  await axios.post('/system/health/refresh');
  window.location.reload();
};
```

## Monitoring Thresholds

### CPU Usage
- **Normal**: 0-70%
- **Warning**: 70-85%
- **Critical**: > 85%

### Memory Usage
- **Normal**: 0-75%
- **Warning**: 75-90%
- **Critical**: > 90%

### Disk Usage
- **Normal**: 0-80%
- **Warning**: 80-90%
- **Critical**: > 90%

### Database Response Time
- **Normal**: < 50ms
- **Warning**: 50-100ms
- **Critical**: > 100ms

### Queue Performance
- **Normal**: < 100 pending jobs
- **Warning**: 100-500 pending jobs
- **Critical**: > 500 pending jobs

## Future Enhancements
- Historical metrics with time-series graphs
- Alert notifications via email/Slack
- Metric export to external monitoring tools
- Custom threshold configuration
- Predictive analysis and trending
- Service dependency mapping
- Health check scheduling and reporting
