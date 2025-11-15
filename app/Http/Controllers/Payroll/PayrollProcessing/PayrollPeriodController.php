<?php

namespace App\Http\Controllers\Payroll\PayrollProcessing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollPeriodController extends Controller
{
    /**
     * Display a listing of payroll periods with filtering
     */
    public function index(Request $request)
    {
        // Mock payroll periods data - In production, this would be from the database
        $allPeriods = [
            [
                'id' => 1,
                'name' => 'November 2025 - 1st Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-15',
                'cutoff_date' => '2025-11-15',
                'pay_date' => '2025-11-20',
                'status' => 'calculating',
                'total_employees' => 245,
                'total_gross_pay' => 2850000.00,
                'total_deductions' => 485000.00,
                'total_net_pay' => 2365000.00,
                'total_employer_cost' => 450000.00,
                'processed_at' => null,
                'approved_by' => null,
                'approved_at' => null,
                'finalized_by' => null,
                'finalized_at' => null,
                'created_at' => '2025-10-28 09:00:00',
                'updated_at' => '2025-11-01 14:30:00',
            ],
            [
                'id' => 2,
                'name' => 'October 2025 - 2nd Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-10-16',
                'end_date' => '2025-10-31',
                'cutoff_date' => '2025-10-31',
                'pay_date' => '2025-11-05',
                'status' => 'paid',
                'total_employees' => 244,
                'total_gross_pay' => 2780000.00,
                'total_deductions' => 465000.00,
                'total_net_pay' => 2315000.00,
                'total_employer_cost' => 435000.00,
                'processed_at' => '2025-11-01 10:30:00',
                'approved_by' => 'Maria Santos',
                'approved_at' => '2025-11-02 14:15:00',
                'finalized_by' => 'Maria Santos',
                'finalized_at' => '2025-11-03 08:00:00',
                'created_at' => '2025-10-13 09:00:00',
                'updated_at' => '2025-11-03 08:00:00',
            ],
            [
                'id' => 3,
                'name' => 'October 2025 - 1st Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-10-01',
                'end_date' => '2025-10-15',
                'cutoff_date' => '2025-10-15',
                'pay_date' => '2025-10-20',
                'status' => 'closed',
                'total_employees' => 243,
                'total_gross_pay' => 2920000.00,
                'total_deductions' => 495000.00,
                'total_net_pay' => 2425000.00,
                'total_employer_cost' => 460000.00,
                'processed_at' => '2025-10-18 09:45:00',
                'approved_by' => 'Maria Santos',
                'approved_at' => '2025-10-19 11:20:00',
                'finalized_by' => 'Maria Santos',
                'finalized_at' => '2025-10-20 07:00:00',
                'created_at' => '2025-09-28 09:00:00',
                'updated_at' => '2025-10-20 07:00:00',
            ],
            [
                'id' => 4,
                'name' => 'November 2025 - 2nd Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-11-16',
                'end_date' => '2025-11-30',
                'cutoff_date' => '2025-11-30',
                'pay_date' => '2025-12-05',
                'status' => 'draft',
                'total_employees' => 0,
                'total_gross_pay' => 0.00,
                'total_deductions' => 0.00,
                'total_net_pay' => 0.00,
                'total_employer_cost' => 0.00,
                'processed_at' => null,
                'approved_by' => null,
                'approved_at' => null,
                'finalized_by' => null,
                'finalized_at' => null,
                'created_at' => '2025-11-01 09:00:00',
                'updated_at' => '2025-11-01 09:00:00',
            ],
            [
                'id' => 5,
                'name' => 'December 2025 - Monthly',
                'period_type' => 'monthly',
                'start_date' => '2025-12-01',
                'end_date' => '2025-12-31',
                'cutoff_date' => '2025-12-31',
                'pay_date' => '2026-01-05',
                'status' => 'draft',
                'total_employees' => 0,
                'total_gross_pay' => 0.00,
                'total_deductions' => 0.00,
                'total_net_pay' => 0.00,
                'total_employer_cost' => 0.00,
                'processed_at' => null,
                'approved_by' => null,
                'approved_at' => null,
                'finalized_by' => null,
                'finalized_at' => null,
                'created_at' => '2025-11-01 09:00:00',
                'updated_at' => '2025-11-01 09:00:00',
            ],
        ];

        // Apply filters
        $periods = collect($allPeriods);

        // Filter by search term (search in period name)
        if ($request->filled('search')) {
            $search = strtolower($request->input('search'));
            $periods = $periods->filter(function ($period) use ($search) {
                return strpos(strtolower($period['name']), $search) !== false;
            });
        }

        // Filter by status
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = $request->input('status');
            $periods = $periods->filter(function ($period) use ($status) {
                return $period['status'] === $status;
            });
        }

        // Filter by period type
        if ($request->filled('period_type') && $request->input('period_type') !== 'all') {
            $periodType = $request->input('period_type');
            $periods = $periods->filter(function ($period) use ($periodType) {
                return $period['period_type'] === $periodType;
            });
        }

        // Collect filter values for display in component
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'period_type' => $request->input('period_type'),
            'year' => $request->input('year', date('Y')),
        ];

        return Inertia::render('Payroll/PayrollProcessing/Periods/Index', [
            'periods' => $periods->values()->all(),
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created payroll period
     */
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'period_type' => 'required|in:weekly,bi_weekly,semi_monthly,monthly',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'cutoff_date' => 'required|date',
            'pay_date' => 'required|date|after:end_date',
        ]);

        // In production, save to database
        // $period = PayrollPeriod::create($validated);

        return redirect()->route('payroll.periods.index')
            ->with('success', "Payroll period '{$validated['name']}' created successfully.");
    }

    /**
     * Display the specified payroll period
     */
    public function show($id)
    {
        // Mock: fetch period by ID
        $mockPeriods = [
            1 => [
                'id' => 1,
                'name' => 'November 2025 - 1st Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-15',
                'cutoff_date' => '2025-11-15',
                'pay_date' => '2025-11-20',
                'status' => 'calculating',
                'total_employees' => 245,
                'total_gross_pay' => 2850000.00,
                'total_deductions' => 485000.00,
                'total_net_pay' => 2365000.00,
                'total_employer_cost' => 450000.00,
            ],
        ];

        $period = $mockPeriods[$id] ?? null;

        if (!$period) {
            return redirect()->route('payroll.periods.index')
                ->with('error', 'Payroll period not found.');
        }

        return Inertia::render('Payroll/PeriodDetail', [
            'period' => $period,
        ]);
    }

    /**
     * Show the form for editing the specified payroll period
     */
    public function edit($id)
    {
        // Mock: fetch period by ID for editing
        $mockPeriods = [
            1 => [
                'id' => 1,
                'name' => 'November 2025 - 1st Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-15',
                'cutoff_date' => '2025-11-15',
                'pay_date' => '2025-11-20',
                'status' => 'draft',
                'total_employees' => 0,
                'total_gross_pay' => 0,
                'total_deductions' => 0,
                'total_net_pay' => 0,
                'total_employer_cost' => 0,
            ],
        ];

        $period = $mockPeriods[$id] ?? null;

        if (!$period || $period['status'] !== 'draft') {
            return redirect()->route('payroll.periods.index')
                ->with('error', 'Only draft periods can be edited.');
        }

        return Inertia::render('Payroll/EditPeriod', [
            'period' => $period,
        ]);
    }

    /**
     * Update the specified payroll period
     */
    public function update(Request $request, $id)
    {
        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'period_type' => 'required|in:weekly,bi_weekly,semi_monthly,monthly',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'cutoff_date' => 'required|date',
            'pay_date' => 'required|date|after:end_date',
        ]);

        // In production, update in database
        // $period = PayrollPeriod::findOrFail($id);
        // $period->update($validated);

        return redirect()->route('payroll.periods.index')
            ->with('success', "Payroll period '{$validated['name']}' updated successfully.");
    }

    /**
     * Delete the specified payroll period
     */
    public function destroy($id)
    {
        // In production, delete from database
        // $period = PayrollPeriod::findOrFail($id);
        // $period->delete();

        return redirect()->route('payroll.periods.index')
            ->with('success', 'Payroll period deleted successfully.');
    }

    /**
     * Calculate payroll for the specified period
     */
    public function calculate(Request $request, $id)
    {
        // In production, trigger calculation job
        // $period = PayrollPeriod::findOrFail($id);
        // CalculatePayrollJob::dispatch($period);

        return redirect()->back()
            ->with('success', 'Payroll calculation started. This may take a few moments.');
    }

    /**
     * Approve payroll for the specified period
     */
    public function approve(Request $request, $id)
    {
        // In production, update period status and log approval
        // $period = PayrollPeriod::findOrFail($id);
        // $period->update([
        //     'status' => 'approved',
        //     'approved_by' => auth()->id(),
        //     'approved_at' => now(),
        // ]);

        return redirect()->back()
            ->with('success', 'Payroll period approved successfully.');
    }
}
