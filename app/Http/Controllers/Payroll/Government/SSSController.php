<?php

namespace App\Http\Controllers\Payroll\Government;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class SSSController extends Controller
{
    public function index(Request $request)
    {
        try {
            $contributions = $this->getMockSSSContributions();
            $periods = $this->getMockSSSPeriods();
            $summary = $this->getMockSSSSummary($contributions);
            $remittances = $this->getMockSSSRemittances();
            $r3Reports = $this->getMockSSSR3Reports();

            return Inertia::render('Payroll/Government/SSS/Index', [
                'contributions' => $contributions,
                'periods' => $periods,
                'summary' => $summary,
                'remittances' => $remittances,
                'r3_reports' => $r3Reports,
            ]);
        } catch (\Exception $e) {
            Log::error('SSS page load error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors('Failed to load SSS page');
        }
    }

    public function generateR3(Request $request, int $periodId)
    {
        try {
            $validated = $request->validate([
                'month' => 'required|date_format:Y-m',
            ]);

            Log::info('SSS R3 report generated', [
                'period_id' => $periodId,
                'month' => $validated['month'],
                'generated_by' => auth()->user()->id,
            ]);

            return back()->with('success', 'SSS R3 report generated successfully');
        } catch (\Exception $e) {
            Log::error('SSS R3 generation error', [
                'error' => $e->getMessage(),
            ]);
            return back()->withErrors('Failed to generate SSS R3 report');
        }
    }

    public function downloadR3(int $reportId)
    {
        try {
            $fileContent = $this->generateMockSSSR3Report($reportId, date('Y-m'));
            $fileName = 'SSS_R3_Report_' . date('Y-m-d_His') . '.csv';

            return response($fileContent, 200)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Content-Length', strlen($fileContent));
        } catch (\Exception $e) {
            Log::error('SSS R3 download error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response(['error' => $e->getMessage()], 500)
                ->header('Content-Type', 'application/json');
        }
    }

    public function downloadContributions(int $periodId)
    {
        try {
            $fileContent = $this->generateMockSSSContributionsReport($periodId);
            $fileName = 'SSS_Contributions_' . date('Y-m-d_His') . '.csv';

            return response($fileContent, 200)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Content-Length', strlen($fileContent));
        } catch (\Exception $e) {
            Log::error('SSS contributions download error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response(['error' => $e->getMessage()], 500)
                ->header('Content-Type', 'application/json');
        }
    }

    public function download(Request $request, int $reportId)
    {
        try {
            $type = $request->query('type', 'r3');

            if ($type === 'contributions') {
                return $this->downloadContributions($reportId);
            }

            return $this->downloadR3($reportId);
        } catch (\Exception $e) {
            Log::error('SSS download error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response(['error' => $e->getMessage()], 500)
                ->header('Content-Type', 'application/json');
        }
    }

    public function submit(Request $request, int $reportId)
    {
        try {
            $validated = $request->validate([
                'reference_number' => 'nullable|string',
                'payment_date' => 'nullable|date',
            ]);

            Log::info('SSS R3 report submitted', [
                'report_id' => $reportId,
                'submitted_by' => auth()->user()->id,
                'submission_date' => now(),
            ]);

            return back()->with('success', 'SSS R3 report submitted successfully');
        } catch (\Exception $e) {
            Log::error('SSS submission error', [
                'error' => $e->getMessage(),
            ]);
            return back()->withErrors('Failed to submit SSS R3 report');
        }
    }

    private function getMockSSSContributions(): array
    {
        $brackets = [
            'A' => ['min' => 1000, 'max' => 1249.99],
            'B' => ['min' => 1250, 'max' => 1499.99],
            'C' => ['min' => 1500, 'max' => 1749.99],
            'D' => ['min' => 1750, 'max' => 1999.99],
            'E' => ['min' => 2000, 'max' => 2249.99],
            'F' => ['min' => 2250, 'max' => 2499.99],
            'G' => ['min' => 2500, 'max' => 2749.99],
            'H' => ['min' => 2750, 'max' => 2999.99],
            'I' => ['min' => 3000, 'max' => 3249.99],
            'J' => ['min' => 3250, 'max' => 3499.99],
            'K' => ['min' => 3500, 'max' => 3749.99],
            'L' => ['min' => 3750, 'max' => 3999.99],
            'M' => ['min' => 4000, 'max' => 99999],
        ];

        $rates = [
            'employee' => 0.03,
            'employer' => 0.03,
            'ec' => 0.01,
        ];

        $employees = [
            ['id' => 1, 'name' => 'Juan Dela Cruz', 'employee_number' => 'EMP001', 'sss_number' => '09-1234567-8', 'compensation' => 18000],
            ['id' => 2, 'name' => 'Maria Santos', 'employee_number' => 'EMP002', 'sss_number' => '09-1234567-9', 'compensation' => 22000],
            ['id' => 3, 'name' => 'Pedro Reyes', 'employee_number' => 'EMP003', 'sss_number' => '09-1234567-0', 'compensation' => 15200],
            ['id' => 4, 'name' => 'Rosa Garcia', 'employee_number' => 'EMP004', 'sss_number' => '09-1234567-1', 'compensation' => 16800],
            ['id' => 5, 'name' => 'Carlos Morales', 'employee_number' => 'EMP005', 'sss_number' => '09-1234567-2', 'compensation' => 20800],
        ];

        $contributions = [];
        $month = date('Y-m');

        foreach ($employees as $emp) {
            $compensation = $emp['compensation'];
            
            $bracket = 'A';
            foreach ($brackets as $key => $range) {
                if ($compensation >= $range['min'] && $compensation <= $range['max']) {
                    $bracket = $key;
                    break;
                }
            }

            $employeeShare = round($compensation * $rates['employee'], 2);
            $employerShare = round($compensation * $rates['employer'], 2);
            $ecShare = round($compensation * $rates['ec'], 2);
            $totalContribution = $employeeShare + $employerShare + $ecShare;

            $contributions[] = [
                'id' => $emp['id'],
                'employee_id' => $emp['id'],
                'employee_name' => $emp['name'],
                'employee_number' => $emp['employee_number'],
                'sss_number' => $emp['sss_number'],
                'period_id' => 1,
                'month' => $month,
                'monthly_compensation' => $compensation,
                'sss_bracket' => $bracket,
                'sss_bracket_range' => $brackets[$bracket],
                'employee_contribution' => $employeeShare,
                'employer_contribution' => $employerShare,
                'ec_contribution' => $ecShare,
                'total_contribution' => $totalContribution,
                'is_processed' => true,
                'is_remitted' => false,
                'is_exempted' => false,
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ];
        }

        return $contributions;
    }

    private function getMockSSSPeriods(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'November 2025',
                'month' => '2025-11',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-30',
                'status' => 'processed',
            ],
            [
                'id' => 2,
                'name' => 'October 2025',
                'month' => '2025-10',
                'start_date' => '2025-10-01',
                'end_date' => '2025-10-31',
                'status' => 'submitted',
            ],
            [
                'id' => 3,
                'name' => 'September 2025',
                'month' => '2025-09',
                'start_date' => '2025-09-01',
                'end_date' => '2025-09-30',
                'status' => 'approved',
            ],
        ];
    }

    private function getMockSSSSummary(array $contributions): array
    {
        $totalEmployeeShare = 0;
        $totalEmployerShare = 0;
        $totalECShare = 0;
        $totalCompensation = 0;

        foreach ($contributions as $contrib) {
            $totalEmployeeShare += $contrib['employee_contribution'];
            $totalEmployerShare += $contrib['employer_contribution'];
            $totalECShare += $contrib['ec_contribution'];
            $totalCompensation += $contrib['monthly_compensation'];
        }

        $totalContribution = $totalEmployeeShare + $totalEmployerShare + $totalECShare;

        return [
            'total_employees' => count($contributions),
            'total_monthly_compensation' => $totalCompensation,
            'total_employee_contribution' => $totalEmployeeShare,
            'total_employer_contribution' => $totalEmployerShare,
            'total_ec_contribution' => $totalECShare,
            'total_contribution' => $totalContribution,
            'last_remittance_date' => '2025-10-15',
            'next_due_date' => '2025-12-10',
            'pending_remittances' => 2,
        ];
    }

    private function getMockSSSRemittances(): array
    {
        return [
            [
                'id' => 1,
                'period_id' => 1,
                'month' => '2025-11',
                'remittance_amount' => 2850.00,
                'due_date' => '2025-12-10',
                'payment_date' => null,
                'payment_reference' => null,
                'status' => 'pending',
                'has_penalty' => false,
                'penalty_amount' => 0,
                'contributions' => [
                    'employee_share' => 945.00,
                    'employer_share' => 945.00,
                    'ec_share' => 315.00,
                ],
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ],
            [
                'id' => 2,
                'period_id' => 2,
                'month' => '2025-10',
                'remittance_amount' => 2785.00,
                'due_date' => '2025-11-10',
                'payment_date' => '2025-11-08',
                'payment_reference' => 'SSS-20251108-001',
                'status' => 'paid',
                'has_penalty' => false,
                'penalty_amount' => 0,
                'contributions' => [
                    'employee_share' => 928.33,
                    'employer_share' => 928.33,
                    'ec_share' => 309.44,
                ],
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ],
            [
                'id' => 3,
                'period_id' => 3,
                'month' => '2025-09',
                'remittance_amount' => 2720.00,
                'due_date' => '2025-10-10',
                'payment_date' => '2025-10-12',
                'payment_reference' => 'SSS-20251012-002',
                'status' => 'paid',
                'has_penalty' => true,
                'penalty_amount' => 50.00,
                'penalty_reason' => 'Paid 2 days late',
                'contributions' => [
                    'employee_share' => 906.67,
                    'employer_share' => 906.67,
                    'ec_share' => 302.22,
                ],
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ],
        ];
    }

    private function getMockSSSR3Reports(): array
    {
        return [
            [
                'id' => 1,
                'period_id' => 1,
                'month' => '2025-11',
                'file_name' => 'SSS_R3_2025-11.csv',
                'file_path' => '/reports/sss/R3_2025-11.csv',
                'file_size' => 2048,
                'total_employees' => 185,
                'total_compensation' => 2850000,
                'total_employee_share' => 945000,
                'total_employer_share' => 945000,
                'total_ec_share' => 315000,
                'total_amount' => 2205000,
                'status' => 'ready',
                'submission_status' => 'pending submission',
                'submission_date' => null,
                'rejection_reason' => null,
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ],
            [
                'id' => 2,
                'period_id' => 2,
                'month' => '2025-10',
                'file_name' => 'SSS_R3_2025-10.csv',
                'file_path' => '/reports/sss/R3_2025-10.csv',
                'file_size' => 2048,
                'total_employees' => 185,
                'total_compensation' => 2785000,
                'total_employee_share' => 928333,
                'total_employer_share' => 928333,
                'total_ec_share' => 309444,
                'total_amount' => 2166110,
                'status' => 'submitted',
                'submission_status' => 'accepted',
                'submission_date' => '2025-10-15',
                'rejection_reason' => null,
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ],
            [
                'id' => 3,
                'period_id' => 3,
                'month' => '2025-09',
                'file_name' => 'SSS_R3_2025-09.csv',
                'file_path' => '/reports/sss/R3_2025-09.csv',
                'file_size' => 1920,
                'total_employees' => 180,
                'total_compensation' => 2720000,
                'total_employee_share' => 906667,
                'total_employer_share' => 906667,
                'total_ec_share' => 302222,
                'total_amount' => 2115556,
                'status' => 'submitted',
                'submission_status' => 'accepted',
                'submission_date' => '2025-09-15',
                'rejection_reason' => null,
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ],
        ];
    }

    private function generateMockSSSR3Report(int $periodId, string $month): string
    {
        $employees = [
            ['name' => 'Juan Dela Cruz', 'sss_number' => '09-1234567-8', 'compensation' => 18000, 'ee_share' => 540, 'er_share' => 540, 'ec_share' => 180],
            ['name' => 'Maria Santos', 'sss_number' => '09-1234567-9', 'compensation' => 22000, 'ee_share' => 660, 'er_share' => 660, 'ec_share' => 220],
            ['name' => 'Pedro Reyes', 'sss_number' => '09-1234567-0', 'compensation' => 15200, 'ee_share' => 456, 'er_share' => 456, 'ec_share' => 152],
            ['name' => 'Rosa Garcia', 'sss_number' => '09-1234567-1', 'compensation' => 16800, 'ee_share' => 504, 'er_share' => 504, 'ec_share' => 168],
            ['name' => 'Carlos Morales', 'sss_number' => '09-1234567-2', 'compensation' => 20800, 'ee_share' => 624, 'er_share' => 624, 'ec_share' => 208],
        ];

        $csvContent = "SSS R3 MONTHLY CONTRIBUTION REPORT\n";
        $csvContent .= "Report Period: {$month}\n";
        $csvContent .= "Company: Cathay Metal Corporation\n";
        $csvContent .= "Company TIN: 123456789010\n";
        $csvContent .= "Generated: " . now()->format('F d, Y H:i:s A') . "\n\n";

        $csvContent .= "SEQUENCE,SSS_NUMBER,EMPLOYEE_NAME,MONTHLY_COMPENSATION,EMPLOYEE_SHARE,EMPLOYER_SHARE,EC_SHARE,TOTAL_CONTRIBUTION\n";

        $totalCompensation = 0;
        $totalEEShare = 0;
        $totalERShare = 0;
        $totalECShare = 0;

        foreach ($employees as $index => $emp) {
            $totalCompensation += $emp['compensation'];
            $totalEEShare += $emp['ee_share'];
            $totalERShare += $emp['er_share'];
            $totalECShare += $emp['ec_share'];

            $totalContribution = $emp['ee_share'] + $emp['er_share'] + $emp['ec_share'];

            $csvContent .= sprintf(
                "%d,%s,%s,%.2f,%.2f,%.2f,%.2f,%.2f\n",
                $index + 1,
                $emp['sss_number'],
                $emp['name'],
                $emp['compensation'],
                $emp['ee_share'],
                $emp['er_share'],
                $emp['ec_share'],
                $totalContribution
            );
        }

        $grandTotal = $totalEEShare + $totalERShare + $totalECShare;
        $csvContent .= "\nSUMMARY\n";
        $csvContent .= "Total Employees: " . count($employees) . "\n";
        $csvContent .= "Total Monthly Compensation: ₱" . number_format($totalCompensation, 2) . "\n";
        $csvContent .= "Total Employee Share (EE): ₱" . number_format($totalEEShare, 2) . "\n";
        $csvContent .= "Total Employer Share (ER): ₱" . number_format($totalERShare, 2) . "\n";
        $csvContent .= "Total EC Share: ₱" . number_format($totalECShare, 2) . "\n";
        $csvContent .= "Grand Total: ₱" . number_format($grandTotal, 2) . "\n";

        return $csvContent;
    }

    private function generateMockSSSContributionsReport(int $periodId): string
    {
        $employees = [
            ['name' => 'Juan Dela Cruz', 'sss_number' => '09-1234567-8', 'compensation' => 18000, 'bracket' => 'F'],
            ['name' => 'Maria Santos', 'sss_number' => '09-1234567-9', 'compensation' => 22000, 'bracket' => 'I'],
            ['name' => 'Pedro Reyes', 'sss_number' => '09-1234567-0', 'compensation' => 15200, 'bracket' => 'D'],
            ['name' => 'Rosa Garcia', 'sss_number' => '09-1234567-1', 'compensation' => 16800, 'bracket' => 'E'],
            ['name' => 'Carlos Morales', 'sss_number' => '09-1234567-2', 'compensation' => 20800, 'bracket' => 'H'],
        ];

        $csvContent = "SSS CONTRIBUTIONS SUMMARY REPORT\n";
        $csvContent .= "Period: " . date('F Y') . "\n";
        $csvContent .= "Company: Cathay Metal Corporation\n";
        $csvContent .= "Generated: " . now()->format('F d, Y H:i:s A') . "\n\n";

        $csvContent .= "SEQUENCE,SSS_NUMBER,EMPLOYEE_NAME,MONTHLY_COMPENSATION,SSS_BRACKET,EMPLOYEE_CONTRIBUTION,EMPLOYER_CONTRIBUTION,EC_CONTRIBUTION,TOTAL_CONTRIBUTION\n";

        $totalCompensation = 0;
        $totalEEContrib = 0;
        $totalERContrib = 0;
        $totalECContrib = 0;

        foreach ($employees as $index => $emp) {
            $compensation = $emp['compensation'];
            $eeContrib = round($compensation * 0.03, 2);
            $erContrib = round($compensation * 0.03, 2);
            $ecContrib = round($compensation * 0.01, 2);
            $total = $eeContrib + $erContrib + $ecContrib;

            $totalCompensation += $compensation;
            $totalEEContrib += $eeContrib;
            $totalERContrib += $erContrib;
            $totalECContrib += $ecContrib;

            $csvContent .= sprintf(
                "%d,%s,%s,%.2f,%s,%.2f,%.2f,%.2f,%.2f\n",
                $index + 1,
                $emp['sss_number'],
                $emp['name'],
                $compensation,
                $emp['bracket'],
                $eeContrib,
                $erContrib,
                $ecContrib,
                $total
            );
        }

        $grandTotal = $totalEEContrib + $totalERContrib + $totalECContrib;
        $csvContent .= "\nSUMMARY\n";
        $csvContent .= "Total Employees: " . count($employees) . "\n";
        $csvContent .= "Total Monthly Compensation: ₱" . number_format($totalCompensation, 2) . "\n";
        $csvContent .= "Total Employee Contribution: ₱" . number_format($totalEEContrib, 2) . "\n";
        $csvContent .= "Total Employer Contribution: ₱" . number_format($totalERContrib, 2) . "\n";
        $csvContent .= "Total EC Contribution: ₱" . number_format($totalECContrib, 2) . "\n";
        $csvContent .= "Grand Total Contribution: ₱" . number_format($grandTotal, 2) . "\n";

        return $csvContent;
    }
}
