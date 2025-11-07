<?php

namespace App\Http\Controllers\System\Logs;

use App\Http\Controllers\Controller;
use App\Models\SystemErrorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ErrorLogController extends Controller
{
    /**
     * Display error logs viewer
     */
    public function index(Request $request): Response
    {
        $logs = SystemErrorLog::query()
            ->with(['user', 'resolver'])
            ->when($request->input('level'), function ($query, $level) {
                return $query->where('level', $level);
            })
            ->when($request->input('is_resolved') !== null, function ($query) use ($request) {
                return $query->where('is_resolved', $request->boolean('is_resolved'));
            })
            ->when($request->input('exception_class'), function ($query, $exceptionClass) {
                return $query->where('exception_class', $exceptionClass);
            })
            ->when($request->input('days'), function ($query, $days) {
                return $query->where('created_at', '>=', now()->subDays($days));
            }, function ($query) {
                return $query->where('created_at', '>=', now()->subDays(7)); // Default last 7 days
            })
            ->when($request->input('search'), function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('message', 'like', "%{$search}%")
                      ->orWhere('exception_message', 'like', "%{$search}%")
                      ->orWhere('file', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(30);

        // Statistics
        $stats = [
            'total' => SystemErrorLog::where('created_at', '>=', now()->subDays(7))->count(),
            'unresolved' => SystemErrorLog::unresolved()
                ->where('created_at', '>=', now()->subDays(7))
                ->count(),
            'critical' => SystemErrorLog::critical()
                ->where('created_at', '>=', now()->subDays(7))
                ->count(),
            'by_level' => SystemErrorLog::select('level', DB::raw('count(*) as count'))
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('level')
                ->pluck('count', 'level')
                ->toArray(),
        ];

        // Get unique exception classes for filter
        $exceptionClasses = SystemErrorLog::select('exception_class')
            ->whereNotNull('exception_class')
            ->distinct()
            ->orderBy('exception_class')
            ->pluck('exception_class')
            ->toArray();

        // Error trend analysis (last 7 days)
        $errorTrend = SystemErrorLog::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                ];
            })
            ->toArray();

        return Inertia::render('System/Logs/ErrorLogs', [
            'logs' => $logs,
            'stats' => $stats,
            'exceptionClasses' => $exceptionClasses,
            'errorTrend' => $errorTrend,
            'filters' => [
                'level' => $request->input('level'),
                'is_resolved' => $request->input('is_resolved'),
                'exception_class' => $request->input('exception_class'),
                'days' => $request->input('days', 7),
                'search' => $request->input('search'),
            ],
        ]);
    }

    /**
     * Show detailed error log entry
     */
    public function show(SystemErrorLog $errorLog): Response
    {
        $errorLog->load(['user', 'resolver']);

        // Get similar errors
        $similarErrors = [];
        if ($errorLog->exception_class && $errorLog->exception_message) {
            $similarErrors = SystemErrorLog::where('id', '!=', $errorLog->id)
                ->where('exception_class', $errorLog->exception_class)
                ->where('exception_message', $errorLog->exception_message)
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('System/Logs/ErrorLogDetail', [
            'errorLog' => $errorLog,
            'similarErrors' => $similarErrors,
        ]);
    }

    /**
     * Mark error as resolved
     */
    public function resolve(Request $request, SystemErrorLog $errorLog)
    {
        $validated = $request->validate([
            'resolution_notes' => 'required|string|max:1000',
        ]);

        $errorLog->update([
            'is_resolved' => true,
            'resolution_notes' => $validated['resolution_notes'],
            'resolved_by' => Auth::id(),
            'resolved_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Error marked as resolved');
    }

    /**
     * Bulk resolve similar errors
     */
    public function bulkResolve(Request $request, SystemErrorLog $errorLog)
    {
        $validated = $request->validate([
            'resolution_notes' => 'required|string|max:1000',
        ]);

        // Resolve all errors with same exception class and message
        SystemErrorLog::where('exception_class', $errorLog->exception_class)
            ->where('exception_message', $errorLog->exception_message)
            ->where('is_resolved', false)
            ->update([
                'is_resolved' => true,
                'resolution_notes' => $validated['resolution_notes'],
                'resolved_by' => Auth::id(),
                'resolved_at' => now(),
            ]);

        return redirect()->back()->with('success', 'All similar errors marked as resolved');
    }

    /**
     * Delete old resolved errors
     */
    public function cleanup(Request $request)
    {
        $validated = $request->validate([
            'days' => 'required|integer|min:30', // At least 30 days old
        ]);

        $deleted = SystemErrorLog::resolved()
            ->where('resolved_at', '<=', now()->subDays($validated['days']))
            ->delete();

        return redirect()->back()->with('success', "Deleted {$deleted} resolved error logs");
    }
}
