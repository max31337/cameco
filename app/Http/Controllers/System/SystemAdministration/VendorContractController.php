<?php

namespace App\Http\Controllers\System\SystemAdministration;

use App\Http\Controllers\Controller;
use App\Services\System\VendorContractService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Vendor Contract Controller
 * 
 * Manages vendor support contract settings and display.
 */
class VendorContractController extends Controller
{
    public function __construct(
        protected VendorContractService $contractService
    ) {}

    /**
     * Display vendor contract information
     */
    public function index(Request $request): Response
    {
        $contract = $this->contractService->getContractDetails();
        
        return Inertia::render('System/VendorContract', [
            'contract' => $contract,
        ]);
    }

    /**
     * Clear cached contract data
     * 
     * Forces a refresh of contract data from config/vendor.php
     */
    public function clearCache(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->contractService->clearCache();
        
        return redirect()->back()->with('success', 'Contract cache cleared successfully.');
    }

    /**
     * Get contract data as JSON (API endpoint)
     */
    public function show(Request $request): \Illuminate\Http\JsonResponse
    {
        $contract = $this->contractService->getContractDetails();
        
        return response()->json($contract);
    }
}
