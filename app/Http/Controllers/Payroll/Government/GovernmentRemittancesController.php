<?php

namespace App\Http\Controllers\Payroll\Government;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

/**
 * GovernmentRemittancesController
 * Manages consolidated government remittance tracking and payment coordination
 * 
 * Tracks remittances to 4 agencies:
 * - BIR (Bureau of Internal Revenue) - Withholding Tax
 * - SSS (Social Security System) - Contributions via R3
 * - PhilHealth (Philippine Health Insurance) - Premiums via RF1
 * - Pag-IBIG (Home Development Mutual Fund) - Contributions via MCRF
 * 
 * Due Date: 10th of following month for all agencies
 * Late Payment Penalties: 5% per month (BIR, SSS, PhilHealth), 3% (Pag-IBIG)
 */
class GovernmentRemittancesController extends Controller
{
    public function index()
    {
        $periods = $this->getMockRemittancePeriods();
        $remittances = $this->getMockGovernmentRemittances();
        $summary = $this->getMockRemittanceSummary();
        $calendarEvents = $this->getMockCalendarEvents();

        return Inertia::render('Payroll/Government/Remittances/Index', [
            'remittances' => $remittances,
            'periods' => $periods,
            'summary' => $summary,
            'calendarEvents' => $calendarEvents,
        ]);
    }

    public function recordPayment(Request $request, int $remittanceId)
    {
        $validated = $request->validate([
            'payment_date' => 'required|date',
            'payment_reference' => 'required|string',
            'payment_amount' => 'required|numeric|min:0',
        ]);

        try {
            return response()->json([
                'success' => true,
                'message' => 'Payment recorded successfully',
                'payment_date' => $validated['payment_date'],
                'payment_reference' => $validated['payment_reference'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to record payment'], 500);
        }
    }

    public function sendReminder(Request $request, int $remittanceId)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Reminder sent successfully',
                'sent_at' => now()->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to send reminder'], 500);
        }
    }

    private function getMockRemittancePeriods()
    {
        return [
            [
                'id' => 1,
                'name' => 'November 2025',
                'month' => '2025-11',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-30',
                'status' => 'pending',
            ],
            [
                'id' => 2,
                'name' => 'October 2025',
                'month' => '2025-10',
                'start_date' => '2025-10-01',
                'end_date' => '2025-10-31',
                'status' => 'completed',
            ],
            [
                'id' => 3,
                'name' => 'September 2025',
                'month' => '2025-09',
                'start_date' => '2025-09-01',
                'end_date' => '2025-09-30',
                'status' => 'completed',
            ],
        ];
    }

    private function getMockGovernmentRemittances()
    {
        $today = now();
        $birDueDate = '2025-12-10';
        $sssDueDate = '2025-12-10';
        $philHealthDueDate = '2025-12-10';
        $pagIbigDueDate = '2025-12-10';

        return [
            // November 2025 - BIR Withholding Tax
            [
                'id' => 1,
                'period_id' => 1,
                'month' => '2025-11',
                'agency' => 'BIR',
                'agency_full_name' => 'Bureau of Internal Revenue',
                'remittance_amount' => 45000.00,
                'report_type' => '1601C',
                'employees_covered' => 25,
                'due_date' => $birDueDate,
                'payment_date' => null,
                'payment_reference' => null,
                'status' => 'pending',
                'days_until_due' => (strtotime($birDueDate) - strtotime('2025-11-21')) / 86400,
                'is_overdue' => false,
                'has_penalty' => false,
                'penalty_amount' => 0,
                'penalty_rate' => 5,
                'remittance_method' => 'eFPS',
                'notes' => 'Form 1601C withheld from November payroll',
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            // November 2025 - SSS Contributions
            [
                'id' => 2,
                'period_id' => 1,
                'month' => '2025-11',
                'agency' => 'SSS',
                'agency_full_name' => 'Social Security System',
                'remittance_amount' => 52500.00,
                'report_type' => 'R3',
                'employees_covered' => 25,
                'due_date' => $sssDueDate,
                'payment_date' => null,
                'payment_reference' => null,
                'status' => 'pending',
                'days_until_due' => (strtotime($sssDueDate) - strtotime('2025-11-21')) / 86400,
                'is_overdue' => false,
                'has_penalty' => false,
                'penalty_amount' => 0,
                'penalty_rate' => 5,
                'remittance_method' => 'eR3',
                'notes' => 'SSS contributions 7% (3% EE + 3% ER + 1% EC)',
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            // November 2025 - PhilHealth Premiums
            [
                'id' => 3,
                'period_id' => 1,
                'month' => '2025-11',
                'agency' => 'PhilHealth',
                'agency_full_name' => 'Philippine Health Insurance Corporation',
                'remittance_amount' => 18500.00,
                'report_type' => 'RF1',
                'employees_covered' => 25,
                'due_date' => $philHealthDueDate,
                'payment_date' => null,
                'payment_reference' => null,
                'status' => 'pending',
                'days_until_due' => (strtotime($philHealthDueDate) - strtotime('2025-11-21')) / 86400,
                'is_overdue' => false,
                'has_penalty' => false,
                'penalty_amount' => 0,
                'penalty_rate' => 5,
                'remittance_method' => 'EPRS',
                'notes' => 'PhilHealth premiums 5% (2.5% EE + 2.5% ER)',
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            // November 2025 - Pag-IBIG Contributions
            [
                'id' => 4,
                'period_id' => 1,
                'month' => '2025-11',
                'agency' => 'Pag-IBIG',
                'agency_full_name' => 'Home Development Mutual Fund',
                'remittance_amount' => 13200.00,
                'report_type' => 'MCRF',
                'employees_covered' => 25,
                'due_date' => $pagIbigDueDate,
                'payment_date' => null,
                'payment_reference' => null,
                'status' => 'pending',
                'days_until_due' => (strtotime($pagIbigDueDate) - strtotime('2025-11-21')) / 86400,
                'is_overdue' => false,
                'has_penalty' => false,
                'penalty_amount' => 0,
                'penalty_rate' => 3,
                'remittance_method' => 'eSRS',
                'notes' => 'Pag-IBIG contributions 3-4% (1-2% EE + 2% ER)',
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            // October 2025 - BIR (PAID)
            [
                'id' => 5,
                'period_id' => 2,
                'month' => '2025-10',
                'agency' => 'BIR',
                'agency_full_name' => 'Bureau of Internal Revenue',
                'remittance_amount' => 43000.00,
                'report_type' => '1601C',
                'employees_covered' => 25,
                'due_date' => '2025-11-10',
                'payment_date' => '2025-11-08',
                'payment_reference' => 'BIR-2025-10-001',
                'status' => 'paid',
                'days_until_due' => -43,
                'is_overdue' => false,
                'has_penalty' => false,
                'penalty_amount' => 0,
                'penalty_rate' => 5,
                'remittance_method' => 'eFPS',
                'notes' => 'Form 1601C - Early payment',
                'created_at' => now()->subMonth()->toDateTimeString(),
                'updated_at' => now()->subMonth()->toDateTimeString(),
            ],
            // October 2025 - SSS (PAID)
            [
                'id' => 6,
                'period_id' => 2,
                'month' => '2025-10',
                'agency' => 'SSS',
                'agency_full_name' => 'Social Security System',
                'remittance_amount' => 50000.00,
                'report_type' => 'R3',
                'employees_covered' => 25,
                'due_date' => '2025-11-10',
                'payment_date' => '2025-11-10',
                'payment_reference' => 'SSS-2025-10-001',
                'status' => 'paid',
                'days_until_due' => -41,
                'is_overdue' => false,
                'has_penalty' => false,
                'penalty_amount' => 0,
                'penalty_rate' => 5,
                'remittance_method' => 'eR3',
                'notes' => 'SSS contributions on time',
                'created_at' => now()->subMonth()->toDateTimeString(),
                'updated_at' => now()->subMonth()->toDateTimeString(),
            ],
            // October 2025 - PhilHealth (PAID)
            [
                'id' => 7,
                'period_id' => 2,
                'month' => '2025-10',
                'agency' => 'PhilHealth',
                'agency_full_name' => 'Philippine Health Insurance Corporation',
                'remittance_amount' => 17500.00,
                'report_type' => 'RF1',
                'employees_covered' => 25,
                'due_date' => '2025-11-10',
                'payment_date' => '2025-11-12',
                'payment_reference' => 'PH-2025-10-001',
                'status' => 'late',
                'days_until_due' => -41,
                'is_overdue' => true,
                'has_penalty' => true,
                'penalty_amount' => 875.00,
                'penalty_rate' => 5,
                'remittance_method' => 'EPRS',
                'notes' => 'PhilHealth premiums - 2 days late',
                'created_at' => now()->subMonth()->toDateTimeString(),
                'updated_at' => now()->subMonth()->toDateTimeString(),
            ],
            // October 2025 - Pag-IBIG (PAID)
            [
                'id' => 8,
                'period_id' => 2,
                'month' => '2025-10',
                'agency' => 'Pag-IBIG',
                'agency_full_name' => 'Home Development Mutual Fund',
                'remittance_amount' => 12800.00,
                'report_type' => 'MCRF',
                'employees_covered' => 25,
                'due_date' => '2025-11-10',
                'payment_date' => '2025-11-10',
                'payment_reference' => 'PB-2025-10-001',
                'status' => 'paid',
                'days_until_due' => -41,
                'is_overdue' => false,
                'has_penalty' => false,
                'penalty_amount' => 0,
                'penalty_rate' => 3,
                'remittance_method' => 'eSRS',
                'notes' => 'Pag-IBIG contributions on time',
                'created_at' => now()->subMonth()->toDateTimeString(),
                'updated_at' => now()->subMonth()->toDateTimeString(),
            ],
            // September 2025 - BIR (PAID - OVERDUE)
            [
                'id' => 9,
                'period_id' => 3,
                'month' => '2025-09',
                'agency' => 'BIR',
                'agency_full_name' => 'Bureau of Internal Revenue',
                'remittance_amount' => 42000.00,
                'report_type' => '1601C',
                'employees_covered' => 25,
                'due_date' => '2025-10-10',
                'payment_date' => '2025-10-25',
                'payment_reference' => 'BIR-2025-09-001',
                'status' => 'overdue',
                'days_until_due' => -52,
                'is_overdue' => true,
                'has_penalty' => true,
                'penalty_amount' => 2100.00,
                'penalty_rate' => 5,
                'remittance_method' => 'eFPS',
                'notes' => 'BIR - 15 days late, 5% penalty applied',
                'created_at' => now()->subMonths(2)->toDateTimeString(),
                'updated_at' => now()->subMonths(2)->toDateTimeString(),
            ],
        ];
    }

    private function getMockRemittanceSummary()
    {
        $remittances = $this->getMockGovernmentRemittances();

        $pending = array_filter($remittances, fn($r) => $r['status'] === 'pending');
        $paid = array_filter($remittances, fn($r) => $r['status'] === 'paid');
        $overdue = array_filter($remittances, fn($r) => in_array($r['status'], ['overdue', 'late']));

        $totalToRemit = array_sum(array_column($remittances, 'remittance_amount'));
        $pendingAmount = array_sum(array_column($pending, 'remittance_amount'));
        $paidAmount = array_sum(array_column($paid, 'remittance_amount'));
        $overdueAmount = array_sum(array_column($overdue, 'remittance_amount'));

        $birAmount = array_sum(array_column(array_filter($remittances, fn($r) => $r['agency'] === 'BIR'), 'remittance_amount'));
        $sssAmount = array_sum(array_column(array_filter($remittances, fn($r) => $r['agency'] === 'SSS'), 'remittance_amount'));
        $philHealthAmount = array_sum(array_column(array_filter($remittances, fn($r) => $r['agency'] === 'PhilHealth'), 'remittance_amount'));
        $pagIbigAmount = array_sum(array_column(array_filter($remittances, fn($r) => $r['agency'] === 'Pag-IBIG'), 'remittance_amount'));

        return [
            'total_to_remit' => $totalToRemit,
            'pending_amount' => $pendingAmount,
            'paid_amount' => $paidAmount,
            'overdue_amount' => $overdueAmount,
            'bir_amount' => $birAmount,
            'sss_amount' => $sssAmount,
            'philhealth_amount' => $philHealthAmount,
            'pagibig_amount' => $pagIbigAmount,
            'total_remittances' => count($remittances),
            'pending_count' => count($pending),
            'paid_count' => count($paid),
            'overdue_count' => count($overdue),
            'next_due_date' => '2025-12-10',
            'last_paid_date' => '2025-11-12',
        ];
    }

    private function getMockCalendarEvents()
    {
        $remittances = $this->getMockGovernmentRemittances();
        $events = [];

        foreach ($remittances as $remittance) {
            $events[] = [
                'id' => $remittance['id'],
                'remittance_id' => $remittance['id'],
                'date' => $remittance['due_date'],
                'agency' => $remittance['agency'],
                'status' => $remittance['status'],
                'amount' => $remittance['remittance_amount'],
                'report_type' => $remittance['report_type'],
            ];
        }

        return $events;
    }
}
