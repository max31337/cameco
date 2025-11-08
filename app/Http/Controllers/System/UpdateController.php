<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Services\System\PatchDeploymentService;
use App\Services\System\UpdateService;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UpdateController extends Controller
{
    use LogsSecurityAudits;

    public function __construct(
        private UpdateService $updateService,
        private PatchDeploymentService $deploymentService
    ) {}

    /**
     * Display the update management page
     */
    public function index(): Response
    {
        // Check for available updates
        $updateInfo = $this->updateService->checkForUpdates();

        // Get update history
        $history = $this->updateService->getUpdateHistory(20);

        // Get current system info
        $systemInfo = [
            'current_version' => $this->updateService->getCurrentVersion(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'environment' => app()->environment(),
        ];

        return Inertia::render('System/Updates', [
            'updateInfo' => $updateInfo,
            'history' => $history,
            'systemInfo' => $systemInfo,
        ]);
    }

    /**
     * Check for updates manually
     */
    public function check(Request $request)
    {
        // Clear cache and check again
        $this->updateService->clearCache();
        $updateInfo = $this->updateService->checkForUpdates();

        // Log audit event
        $this->logAudit(
            'update_check',
            'info',
            [
                'available' => $updateInfo['available'],
                'latest_version' => $updateInfo['latest_version'] ?? null,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $updateInfo,
        ]);
    }

    /**
     * Download update package
     */
    public function download(Request $request)
    {
        $request->validate([
            'download_url' => 'required|url',
            'checksum' => 'required|string',
            'version' => 'required|string',
        ]);

        $result = $this->updateService->downloadUpdate(
            $request->download_url,
            $request->checksum
        );

        if ($result['success']) {
            // Log audit event
            $this->logAudit(
                'update_download',
                'info',
                [
                    'version' => $request->version,
                    'filename' => $result['filename'],
                ]
            );
        }

        return response()->json($result);
    }

    /**
     * Deploy patch/update
     */
    public function deploy(Request $request)
    {
        $request->validate([
            'filepath' => 'required|string',
            'version' => 'required|string',
        ]);

        // Check if user has permission
        if (!auth()->user()->hasRole('Superadmin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Superadmin role required',
            ], 403);
        }

        $result = $this->deploymentService->deployPatch(
            $request->filepath,
            $request->version,
            auth()->id()
        );

        return response()->json($result);
    }

    /**
     * Get deployment progress
     */
    public function progress(Request $request, string $deploymentId)
    {
        $progress = $this->deploymentService->getDeploymentProgress($deploymentId);

        return response()->json($progress);
    }

    /**
     * Rollback to previous version
     */
    public function rollback(Request $request)
    {
        $request->validate([
            'backup_id' => 'required|string',
        ]);

        // Check if user has permission
        if (!auth()->user()->hasRole('Superadmin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Superadmin role required',
            ], 403);
        }

        $result = $this->deploymentService->rollbackDeployment($request->backup_id);

        // Log audit event
        $this->logAudit(
            'system_rollback',
            'warning',
            [
                'backup_id' => $request->backup_id,
                'success' => $result['success'],
            ]
        );

        return response()->json($result);
    }
}
