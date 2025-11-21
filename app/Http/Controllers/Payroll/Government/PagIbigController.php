<?php

namespace App\Http\Controllers\Payroll\Government;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

/**
 * PagIbigController
 * Manages Pag-IBIG contributions tracking and reporting
 * 
 * Pag-IBIG Rate: 3-4% of monthly compensation
 * - Employee Share (EE): 1% or 2%
 * - Employer Share (ER): 2%
 * - Maximum contribution: ₱100 each (EE & ER)
 * 
 * Report Format: MCRF (CSV) for Pag-IBIG eSRS portal submission
 * Due Date: 10th of following month
 * Supports loan deductions with amortization tracking
 */
class PagIbigController extends Controller
{
    public function index()
    {
        $periods = $this->getMockPagIbigPeriods();
        $contributions = $this->getMockPagIbigContributions();
        $summary = $this->getMockPagIbigSummary();
        $remittances = $this->getMockPagIbigRemittances();
        $mcrf_reports = $this->getMockPagIbigMCRFReports();
        $loan_deductions = $this->getMockPagIbigLoanDeductions();

        return Inertia::render('Payroll/Government/PagIbig/Index', [
            'contributions' => $contributions,
            'periods' => $periods,
            'summary' => $summary,
            'remittances' => $remittances,
            'mcrf_reports' => $mcrf_reports,
            'loan_deductions' => $loan_deductions,
        ]);
    }

    public function generateMCRF(Request $request, int $periodId)
    {
        $report = $this->generateMockPagIbigMCRFReport();
        
        return response()->json([
            'success' => true,
            'message' => 'MCRF report generated successfully',
            'report' => $report,
        ]);
    }

    public function downloadMCRF(int $reportId)
    {
        $report = $this->generateMockPagIbigMCRFReport();
        $csv = $this->formatPagIbigMCRFCSV($report);

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $report['file_name'] . '"',
            'Content-Length' => strlen($csv),
            'Pragma' => 'no-cache',
        ]);
    }

    public function downloadContributions(int $periodId)
    {
        $contributions = $this->getMockPagIbigContributions();
        $period = $this->getMockPagIbigPeriods()[0];
        
        $csv = "Pag-IBIG Contributions Summary\n";
        $csv .= "Period: " . $period['name'] . "\n";
        $csv .= "Generated: " . now()->format('Y-m-d H:i:s') . "\n\n";
        $csv .= "Employee Number,Employee Name,Pag-IBIG Number,Monthly Comp,EE Rate,EE Contribution,ER Contribution (2%),Total,Loan\n";

        foreach ($contributions as $contrib) {
            $loan_status = $contrib['has_active_loan'] ? 'YES' : 'NO';
            $csv .= $contrib['employee_number'] . ',' . $contrib['employee_name'] . ',' . $contrib['pagibig_number'] . ','
                . number_format($contrib['monthly_compensation'], 2) . ','
                . $contrib['employee_rate'] . '%,'
                . number_format($contrib['employee_contribution'], 2) . ','
                . number_format($contrib['employer_contribution'], 2) . ','
                . number_format($contrib['total_contribution'], 2) . ',' . $loan_status . "\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="pagibig_contributions_' . now()->format('Y-m-d') . '.csv"',
            'Content-Length' => strlen($csv),
        ]);
    }

    public function download(Request $request, int $reportId)
    {
        $type = $request->query('type', 'mcrf');
        return ($type === 'mcrf') ? $this->downloadMCRF($reportId) : response()->json(['success' => false], 400);
    }

    public function submit(Request $request, int $reportId)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'MCRF report submitted successfully',
                'submission_date' => now()->toDateTimeString(),
                'reference_number' => 'PB-'.now()->format('Ym').'-'.str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to submit MCRF report'], 500);
        }
    }

    private function getMockPagIbigPeriods()
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

    private function getMockPagIbigContributions()
    {
        $employees = [
            ['id' => 1, 'name' => 'Juan Dela Cruz', 'number' => 'EMP001', 'compensation' => 30000, 'pb_number' => 'PB-0001-123456', 'rate' => 1, 'has_loan' => false],
            ['id' => 2, 'name' => 'Maria Santos', 'number' => 'EMP002', 'compensation' => 45000, 'pb_number' => 'PB-0002-987654', 'rate' => 2, 'has_loan' => true],
            ['id' => 3, 'name' => 'Jose Rodriguez', 'number' => 'EMP003', 'compensation' => 25000, 'pb_number' => 'PB-0003-555555', 'rate' => 1, 'has_loan' => false],
            ['id' => 4, 'name' => 'Ana Garcia', 'number' => 'EMP004', 'compensation' => 35000, 'pb_number' => 'PB-0004-666666', 'rate' => 1, 'has_loan' => true],
            ['id' => 5, 'name' => 'Carlos Mendoza', 'number' => 'EMP005', 'compensation' => 50000, 'pb_number' => 'PB-0005-777777', 'rate' => 2, 'has_loan' => false],
        ];

        $contributions = [];
        $period = $this->getMockPagIbigPeriods()[0];

        foreach ($employees as $emp) {
            $ee_contrib = min($emp['compensation'] * ($emp['rate'] / 100), 100);
            $er_contrib = min($emp['compensation'] * 0.02, 100);

            $contributions[] = [
                'id' => $emp['id'],
                'employee_id' => $emp['id'],
                'employee_name' => $emp['name'],
                'employee_number' => $emp['number'],
                'pagibig_number' => $emp['pb_number'],
                'period_id' => $period['id'],
                'month' => $period['month'],
                'monthly_compensation' => $emp['compensation'],
                'employee_rate' => $emp['rate'],
                'employee_contribution' => $ee_contrib,
                'employer_contribution' => $er_contrib,
                'total_contribution' => $ee_contrib + $er_contrib,
                'is_processed' => true,
                'is_remitted' => $period['status'] === 'completed',
                'has_active_loan' => $emp['has_loan'],
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ];
        }

        return $contributions;
    }

    private function getMockPagIbigSummary()
    {
        $contributions = $this->getMockPagIbigContributions();
        $total_comp = array_sum(array_column($contributions, 'monthly_compensation'));
        $total_ee = array_sum(array_column($contributions, 'employee_contribution'));
        $total_er = array_sum(array_column($contributions, 'employer_contribution'));
        $loans = $this->getMockPagIbigLoanDeductions();
        $total_loan_deductions = array_sum(array_column($loans, 'monthly_deduction'));

        return [
            'total_employees' => count($contributions),
            'total_monthly_compensation' => $total_comp,
            'total_employee_contribution' => $total_ee,
            'total_employer_contribution' => $total_er,
            'total_contribution' => $total_ee + $total_er,
            'total_loan_deductions' => $total_loan_deductions,
            'last_remittance_date' => '2025-10-15',
            'next_due_date' => '2025-12-10',
            'pending_remittances' => 1,
        ];
    }

    private function getMockPagIbigRemittances()
    {
        return [
            [
                'id' => 1,
                'period_id' => 1,
                'month' => '2025-11',
                'remittance_amount' => 445.00,
                'due_date' => '2025-12-10',
                'payment_date' => null,
                'payment_reference' => null,
                'status' => 'pending',
                'has_penalty' => false,
                'penalty_amount' => 0,
                'contributions' => [
                    'employee_share' => 224.00,
                    'employer_share' => 221.00,
                ],
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            [
                'id' => 2,
                'period_id' => 2,
                'month' => '2025-10',
                'remittance_amount' => 445.00,
                'due_date' => '2025-11-10',
                'payment_date' => '2025-11-08',
                'payment_reference' => 'PB-2025-10-0001',
                'status' => 'paid',
                'has_penalty' => false,
                'penalty_amount' => 0,
                'contributions' => [
                    'employee_share' => 224.00,
                    'employer_share' => 221.00,
                ],
                'created_at' => now()->subMonth()->toDateTimeString(),
                'updated_at' => now()->subMonth()->toDateTimeString(),
            ],
            [
                'id' => 3,
                'period_id' => 3,
                'month' => '2025-09',
                'remittance_amount' => 445.00,
                'due_date' => '2025-10-10',
                'payment_date' => '2025-10-15',
                'payment_reference' => 'PB-2025-09-0001',
                'status' => 'overdue',
                'has_penalty' => true,
                'penalty_amount' => 22.25,
                'penalty_reason' => 'Late payment (5 days)',
                'contributions' => [
                    'employee_share' => 224.00,
                    'employer_share' => 221.00,
                ],
                'created_at' => now()->subMonths(2)->toDateTimeString(),
                'updated_at' => now()->subMonths(2)->toDateTimeString(),
            ],
        ];
    }

    private function getMockPagIbigMCRFReports()
    {
        return [
            [
                'id' => 1,
                'period_id' => 1,
                'month' => '2025-11',
                'file_name' => 'pb_mcrf_2025-11.csv',
                'file_path' => '/reports/pb_mcrf_2025-11.csv',
                'file_size' => 2048,
                'total_employees' => 5,
                'total_employee_contribution' => 224.00,
                'total_employer_contribution' => 221.00,
                'total_contribution' => 445.00,
                'employees_with_loans' => 2,
                'status' => 'ready',
                'submission_status' => 'Not submitted',
                'submission_date' => null,
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            [
                'id' => 2,
                'period_id' => 2,
                'month' => '2025-10',
                'file_name' => 'pb_mcrf_2025-10.csv',
                'file_path' => '/reports/pb_mcrf_2025-10.csv',
                'file_size' => 2048,
                'total_employees' => 5,
                'total_employee_contribution' => 224.00,
                'total_employer_contribution' => 221.00,
                'total_contribution' => 445.00,
                'employees_with_loans' => 2,
                'status' => 'submitted',
                'submission_status' => 'Submitted',
                'submission_date' => '2025-10-15',
                'created_at' => now()->subMonth()->toDateTimeString(),
                'updated_at' => now()->subMonth()->toDateTimeString(),
            ],
            [
                'id' => 3,
                'period_id' => 3,
                'month' => '2025-09',
                'file_name' => 'pb_mcrf_2025-09.csv',
                'file_path' => '/reports/pb_mcrf_2025-09.csv',
                'file_size' => 2048,
                'total_employees' => 5,
                'total_employee_contribution' => 224.00,
                'total_employer_contribution' => 221.00,
                'total_contribution' => 445.00,
                'employees_with_loans' => 2,
                'status' => 'accepted',
                'submission_status' => 'Accepted',
                'submission_date' => '2025-09-15',
                'created_at' => now()->subMonths(2)->toDateTimeString(),
                'updated_at' => now()->subMonths(2)->toDateTimeString(),
            ],
        ];
    }

    private function getMockPagIbigLoanDeductions()
    {
        return [
            [
                'id' => 1,
                'employee_id' => 2,
                'employee_name' => 'Maria Santos',
                'employee_number' => 'EMP002',
                'loan_number' => 'PB-LOAN-2024-001',
                'loan_type' => 'housing',
                'loan_amount' => 200000.00,
                'disbursement_date' => '2024-01-15',
                'monthly_deduction' => 5000.00,
                'months_remaining' => 35,
                'total_deducted_to_date' => 65000.00,
                'is_active' => true,
                'maturity_date' => '2027-12-15',
                'created_at' => '2024-01-15',
                'updated_at' => now()->toDateTimeString(),
            ],
            [
                'id' => 2,
                'employee_id' => 4,
                'employee_name' => 'Ana Garcia',
                'employee_number' => 'EMP004',
                'loan_number' => 'PB-LOAN-2024-002',
                'loan_type' => 'calamity',
                'loan_amount' => 50000.00,
                'disbursement_date' => '2024-06-01',
                'monthly_deduction' => 2500.00,
                'months_remaining' => 15,
                'total_deducted_to_date' => 20000.00,
                'is_active' => true,
                'maturity_date' => '2026-02-01',
                'created_at' => '2024-06-01',
                'updated_at' => now()->toDateTimeString(),
            ],
        ];
    }

    private function generateMockPagIbigMCRFReport()
    {
        $period = $this->getMockPagIbigPeriods()[0];
        $contributions = $this->getMockPagIbigContributions();
        $total_ee = array_sum(array_column($contributions, 'employee_contribution'));
        $total_er = array_sum(array_column($contributions, 'employer_contribution'));
        $loans = $this->getMockPagIbigLoanDeductions();
        $with_loans = count(array_filter($contributions, fn($c) => $c['has_active_loan']));

        return [
            'id' => uniqid(),
            'period_id' => $period['id'],
            'month' => $period['month'],
            'file_name' => 'pb_mcrf_'.$period['month'].'.csv',
            'file_path' => '/reports/pb_mcrf_'.$period['month'].'.csv',
            'file_size' => 2048,
            'total_employees' => count($contributions),
            'total_employee_contribution' => $total_ee,
            'total_employer_contribution' => $total_er,
            'total_contribution' => $total_ee + $total_er,
            'employees_with_loans' => $with_loans,
            'status' => 'draft',
            'submission_status' => 'Not submitted',
            'submission_date' => null,
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString(),
        ];
    }

    private function formatPagIbigMCRFCSV($report)
    {
        $contributions = $this->getMockPagIbigContributions();
        $csv = "PAG-IBIG MCRF REPORT\n";
        $csv .= "Period: " . $report['month'] . "\n";
        $csv .= "Generated: " . now()->format('Y-m-d H:i:s') . "\n\n";
        $csv .= "Employee Number,Employee Name,Pag-IBIG Number,Monthly Comp,EE Rate,EE Contribution,ER Contribution,Total,Has Loan\n";

        foreach ($contributions as $contrib) {
            $loan_status = $contrib['has_active_loan'] ? 'YES' : 'NO';
            $csv .= $contrib['employee_number'] . ',' . $contrib['employee_name'] . ',' . $contrib['pagibig_number'] . ','
                . number_format($contrib['monthly_compensation'], 2) . ','
                . $contrib['employee_rate'] . '%,'
                . number_format($contrib['employee_contribution'], 2) . ','
                . number_format($contrib['employer_contribution'], 2) . ','
                . number_format($contrib['total_contribution'], 2) . ',' . $loan_status . "\n";
        }

        $csv .= "\n\nREPORT SUMMARY\n";
        $csv .= "Total Employees," . count($contributions) . "\n";
        $csv .= "Total EE Contribution," . number_format($report['total_employee_contribution'], 2) . "\n";
        $csv .= "Total ER Contribution," . number_format($report['total_employer_contribution'], 2) . "\n";
        $csv .= "Total Contribution," . number_format($report['total_contribution'], 2) . "\n";
        $csv .= "Employees with Loans," . $report['employees_with_loans'] . "\n";

        return $csv;
    }
}
