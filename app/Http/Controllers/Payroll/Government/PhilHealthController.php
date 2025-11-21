<?php

namespace App\Http\Controllers\Payroll\Government;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

/**
 * PhilHealthController
 * Manages PhilHealth contributions tracking and reporting
 * PhilHealth Rate: 5% of monthly basic (2.5% EE + 2.5% ER, max 5,000)
 */
class PhilHealthController extends Controller
{
    public function index()
    {
        $periods = $this->getMockPhilHealthPeriods();
        $contributions = $this->getMockPhilHealthContributions();
        $summary = $this->getMockPhilHealthSummary();
        $remittances = $this->getMockPhilHealthRemittances();
        $rf1_reports = $this->getMockPhilHealthRF1Reports();

        return Inertia::render('Payroll/Government/PhilHealth/Index', [
            'contributions' => $contributions,
            'periods' => $periods,
            'summary' => $summary,
            'remittances' => $remittances,
            'rf1_reports' => $rf1_reports,
        ]);
    }

    public function generateRF1(Request $request, int $periodId)
    {
        $report = $this->generateMockPhilHealthRF1Report();
        
        return response()->json([
            'success' => true,
            'message' => 'RF1 report generated successfully',
            'report' => $report,
        ]);
    }

    public function downloadRF1(int $reportId)
    {
        $report = $this->generateMockPhilHealthRF1Report();
        $csv = $this->formatPhilHealthRF1CSV($report);

        try {
            return response($csv, 200, [
                'Content-Type' => 'text/csv; charset=utf-8',
                'Content-Disposition' => 'attachment; filename="'.$report['file_name'].'"',
                'Content-Length' => strlen($csv),
                'Pragma' => 'no-cache',
            ]);
        } catch (\Exception $e) {
            \Log::error('PhilHealth RF1 download error', [
                'report_id' => $reportId,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['success' => false, 'message' => 'Failed to download RF1 report'], 500);
        }
    }

    public function downloadContributions(int $periodId)
    {
        $contributions = $this->getMockPhilHealthContributions();
        $period = $this->getMockPhilHealthPeriods()[0];
        
        $csv = "PhilHealth Contributions Summary\n";
        $csv .= "Period: ".$period['name']."\n";
        $csv .= "Generated: ".now()->format('Y-m-d H:i:s')."\n\n";
        $csv .= "Employee Number,Employee Name,PhilHealth Number,Monthly Basic,EE Premium (2.5%),ER Premium (2.5%),Total Premium (5%),Status\n";

        foreach ($contributions as $contrib) {
            $status = $contrib['is_indigent'] ? 'INDIGENT' : ($contrib['is_remitted'] ? 'REMITTED' : 'PENDING');
            $csv .= $contrib['employee_number'].','.$contrib['employee_name'].','.$contrib['philhealth_number'].','
                .number_format($contrib['monthly_basic'], 2).','
                .number_format($contrib['employee_premium'], 2).','
                .number_format($contrib['employer_premium'], 2).','
                .number_format($contrib['total_premium'], 2).','.$status."\n";
        }

        try {
            return response($csv, 200, [
                'Content-Type' => 'text/csv; charset=utf-8',
                'Content-Disposition' => 'attachment; filename="philhealth_contributions_'.now()->format('Y-m-d').'.csv"',
                'Content-Length' => strlen($csv),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to download contributions'], 500);
        }
    }

    public function download(Request $request, int $reportId)
    {
        $type = $request->query('type', 'rf1');
        return ($type === 'rf1') ? $this->downloadRF1($reportId) : response()->json(['success' => false], 400);
    }

    public function submit(Request $request, int $reportId)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'RF1 report submitted successfully',
                'submission_date' => now()->toDateTimeString(),
                'reference_number' => 'PH-'.now()->format('Ym').'-'.str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to submit RF1 report'], 500);
        }
    }

    private function getMockPhilHealthPeriods()
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

    private function getMockPhilHealthContributions()
    {
        $employees = [
            ['id' => 1, 'name' => 'Juan Dela Cruz', 'number' => 'EMP001', 'basic' => 30000, 'ph_number' => 'PH-0001-123456789-1', 'indigent' => false],
            ['id' => 2, 'name' => 'Maria Santos', 'number' => 'EMP002', 'basic' => 45000, 'ph_number' => 'PH-0002-987654321-1', 'indigent' => false],
            ['id' => 3, 'name' => 'Jose Rodriguez', 'number' => 'EMP003', 'basic' => 25000, 'ph_number' => 'PH-0003-555555555-1', 'indigent' => false],
            ['id' => 4, 'name' => 'Ana Garcia', 'number' => 'EMP004', 'basic' => 35000, 'ph_number' => 'PH-0004-666666666-1', 'indigent' => true],
            ['id' => 5, 'name' => 'Carlos Mendoza', 'number' => 'EMP005', 'basic' => 50000, 'ph_number' => 'PH-0005-777777777-1', 'indigent' => false],
        ];

        $contributions = [];
        $period = $this->getMockPhilHealthPeriods()[0];

        foreach ($employees as $emp) {
            $five_percent = $emp['basic'] * 0.05;
            $premium = min($five_percent, 5000);
            $ee_share = $premium / 2;
            $er_share = $premium / 2;

            $contributions[] = [
                'id' => $emp['id'],
                'employee_id' => $emp['id'],
                'employee_name' => $emp['name'],
                'employee_number' => $emp['number'],
                'philhealth_number' => $emp['ph_number'],
                'period_id' => $period['id'],
                'month' => $period['month'],
                'monthly_basic' => $emp['basic'],
                'employee_premium' => $ee_share,
                'employer_premium' => $er_share,
                'total_premium' => $premium,
                'is_processed' => true,
                'is_remitted' => $period['status'] === 'completed',
                'is_indigent' => $emp['indigent'],
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ];
        }

        return $contributions;
    }

    private function getMockPhilHealthSummary()
    {
        $contributions = $this->getMockPhilHealthContributions();
        $total_basic = array_sum(array_column($contributions, 'monthly_basic'));
        $total_ee = array_sum(array_column($contributions, 'employee_premium'));
        $total_er = array_sum(array_column($contributions, 'employer_premium'));
        $indigent_count = count(array_filter($contributions, fn($c) => $c['is_indigent']));

        return [
            'total_employees' => count($contributions),
            'total_monthly_basic' => $total_basic,
            'total_employee_premium' => $total_ee,
            'total_employer_premium' => $total_er,
            'total_premium' => $total_ee + $total_er,
            'last_remittance_date' => '2025-10-15',
            'next_due_date' => '2025-12-10',
            'pending_remittances' => 1,
            'indigent_members' => $indigent_count,
        ];
    }

    private function getMockPhilHealthRemittances()
    {
        return [
            [
                'id' => 1,
                'period_id' => 1,
                'month' => '2025-11',
                'remittance_amount' => 37500.00,
                'due_date' => '2025-12-10',
                'payment_date' => null,
                'payment_reference' => null,
                'status' => 'pending',
                'has_penalty' => false,
                'penalty_amount' => 0,
                'contributions' => ['employee_share' => 18750.00, 'employer_share' => 18750.00],
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            [
                'id' => 2,
                'period_id' => 2,
                'month' => '2025-10',
                'remittance_amount' => 37500.00,
                'due_date' => '2025-11-10',
                'payment_date' => '2025-11-08',
                'payment_reference' => 'PH-2025-10-0001',
                'status' => 'paid',
                'has_penalty' => false,
                'penalty_amount' => 0,
                'contributions' => ['employee_share' => 18750.00, 'employer_share' => 18750.00],
                'created_at' => now()->subMonth()->toDateTimeString(),
                'updated_at' => now()->subMonth()->toDateTimeString(),
            ],
            [
                'id' => 3,
                'period_id' => 3,
                'month' => '2025-09',
                'remittance_amount' => 37500.00,
                'due_date' => '2025-10-10',
                'payment_date' => '2025-10-12',
                'payment_reference' => 'PH-2025-09-0001',
                'status' => 'overdue',
                'has_penalty' => true,
                'penalty_amount' => 1875.00,
                'penalty_reason' => 'Late payment (2 days)',
                'contributions' => ['employee_share' => 18750.00, 'employer_share' => 18750.00],
                'created_at' => now()->subMonths(2)->toDateTimeString(),
                'updated_at' => now()->subMonths(2)->toDateTimeString(),
            ],
        ];
    }

    private function getMockPhilHealthRF1Reports()
    {
        return [
            [
                'id' => 1,
                'period_id' => 1,
                'month' => '2025-11',
                'file_name' => 'ph_rf1_2025-11.csv',
                'file_path' => '/reports/ph_rf1_2025-11.csv',
                'file_size' => 2048,
                'total_employees' => 5,
                'total_basic_salary' => 185000.00,
                'total_employee_premium' => 18750.00,
                'total_employer_premium' => 18750.00,
                'total_premium' => 37500.00,
                'indigent_count' => 1,
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
                'file_name' => 'ph_rf1_2025-10.csv',
                'file_path' => '/reports/ph_rf1_2025-10.csv',
                'file_size' => 2048,
                'total_employees' => 5,
                'total_basic_salary' => 185000.00,
                'total_employee_premium' => 18750.00,
                'total_employer_premium' => 18750.00,
                'total_premium' => 37500.00,
                'indigent_count' => 1,
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
                'file_name' => 'ph_rf1_2025-09.csv',
                'file_path' => '/reports/ph_rf1_2025-09.csv',
                'file_size' => 2048,
                'total_employees' => 5,
                'total_basic_salary' => 185000.00,
                'total_employee_premium' => 18750.00,
                'total_employer_premium' => 18750.00,
                'total_premium' => 37500.00,
                'indigent_count' => 1,
                'status' => 'accepted',
                'submission_status' => 'Accepted',
                'submission_date' => '2025-09-15',
                'created_at' => now()->subMonths(2)->toDateTimeString(),
                'updated_at' => now()->subMonths(2)->toDateTimeString(),
            ],
        ];
    }

    private function generateMockPhilHealthRF1Report()
    {
        $period = $this->getMockPhilHealthPeriods()[0];
        $contributions = $this->getMockPhilHealthContributions();
        $total_basic = array_sum(array_column($contributions, 'monthly_basic'));
        $total_ee = array_sum(array_column($contributions, 'employee_premium'));
        $total_er = array_sum(array_column($contributions, 'employer_premium'));
        $indigent_count = count(array_filter($contributions, fn($c) => $c['is_indigent']));

        return [
            'id' => uniqid(),
            'period_id' => $period['id'],
            'month' => $period['month'],
            'file_name' => 'ph_rf1_'.$period['month'].'.csv',
            'file_path' => '/reports/ph_rf1_'.$period['month'].'.csv',
            'file_size' => 2048,
            'total_employees' => count($contributions),
            'total_basic_salary' => $total_basic,
            'total_employee_premium' => $total_ee,
            'total_employer_premium' => $total_er,
            'total_premium' => $total_ee + $total_er,
            'indigent_count' => $indigent_count,
            'status' => 'draft',
            'submission_status' => 'Not submitted',
            'submission_date' => null,
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString(),
        ];
    }

    private function formatPhilHealthRF1CSV($report)
    {
        $contributions = $this->getMockPhilHealthContributions();
        $csv = "PHILHEALTH RF1 REPORT\n";
        $csv .= "Period: ".$report['month']."\n";
        $csv .= "Generated: ".now()->format('Y-m-d H:i:s')."\n\n";
        $csv .= "Employee Number,Employee Name,PhilHealth Number,Monthly Basic,EE Premium,ER Premium,Total Premium,Status\n";

        foreach ($contributions as $contrib) {
            $status = $contrib['is_indigent'] ? 'INDIGENT' : 'ACTIVE';
            $csv .= $contrib['employee_number'].','.$contrib['employee_name'].','.$contrib['philhealth_number'].','
                .number_format($contrib['monthly_basic'], 2).','
                .number_format($contrib['employee_premium'], 2).','
                .number_format($contrib['employer_premium'], 2).','
                .number_format($contrib['total_premium'], 2).','.$status."\n";
        }

        $csv .= "\n\nREPORT SUMMARY\n";
        $csv .= "Total Employees,".count($contributions)."\n";
        $csv .= "Total Monthly Basic,".number_format($report['total_basic_salary'], 2)."\n";
        $csv .= "Total EE Premium,".number_format($report['total_employee_premium'], 2)."\n";
        $csv .= "Total ER Premium,".number_format($report['total_employer_premium'], 2)."\n";
        $csv .= "Total Premium (5%),".number_format($report['total_premium'], 2)."\n";
        $csv .= "Indigent Members,".$report['indigent_count']."\n";

        return $csv;
    }
}
