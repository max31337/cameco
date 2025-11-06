<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\SystemPatchApproval;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatchController extends Controller
{
    /**
     * Display patch approval workflow page
     */
    public function index(Request $request): Response
    {
        $patches = SystemPatchApproval::query()
            ->with(['requester', 'approver'])
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('approval_status', $status);
            })
            ->when($request->input('security_only'), function ($query) {
                return $query->security();
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'pending' => SystemPatchApproval::pending()->count(),
            'approved' => SystemPatchApproval::approved()->count(),
            'deployed' => SystemPatchApproval::deployed()->count(),
            'security_pending' => SystemPatchApproval::pending()->security()->count(),
        ];

        return Inertia::render('System/Patches', [
            'patches' => $patches,
            'stats' => $stats,
            'filters' => [
                'status' => $request->input('status'),
                'security_only' => $request->input('security_only'),
            ],
        ]);
    }

    /**
     * Show detailed patch information
     */
    public function show(SystemPatchApproval $patch): Response
    {
        $patch->load(['requester', 'approver']);

        return Inertia::render('System/PatchDetail', [
            'patch' => $patch,
        ]);
    }

    /**
     * Approve a patch
     */
    public function approve(Request $request, SystemPatchApproval $patch): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $patch->update([
            'approval_status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'approval_notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Patch approved successfully.');
    }

    /**
     * Reject a patch
     */
    public function reject(Request $request, SystemPatchApproval $patch): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $patch->update([
            'approval_status' => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'approval_notes' => $validated['notes'],
        ]);

        return redirect()->back()->with('success', 'Patch rejected.');
    }

    /**
     * Mark patch as deployed
     */
    public function markDeployed(SystemPatchApproval $patch): \Illuminate\Http\RedirectResponse
    {
        if ($patch->approval_status !== 'approved') {
            return redirect()->back()->with('error', 'Only approved patches can be marked as deployed.');
        }

        $patch->update([
            'deployed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Patch marked as deployed.');
    }
}
