<?php

namespace App\Http\Controllers\Payroll\PayrollProcessing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollReviewController extends Controller
{
    /**
     * Display payroll review and approval page
     */
    public function index(Request $request, ?int $periodId = null)
    {
        // Use default period ID if not provided
        $periodId = $periodId ?? 1;

        // Get payroll period summary
        $payrollPeriod = $this->getMockPayrollPeriodSummary($periodId);

        // Get summary data
        $summary = $this->getMockSummary($periodId);

        // Get department breakdown
        $departments = $this->getMockDepartmentBreakdown();

        // Get exceptions/anomalies
        $exceptions = $this->getMockExceptions();

        // Get approval workflow
        $approvalWorkflow = $this->getMockApprovalWorkflow($periodId);

        // Get employee calculations
        $employeeCalculations = $this->getMockEmployeeCalculations();

        return Inertia::render('Payroll/PayrollProcessing/Review/Index', [
            'payroll_period' => $payrollPeriod,
            'summary' => $summary,
            'departments' => $departments,
            'exceptions' => $exceptions,
            'approval_workflow' => $approvalWorkflow,
            'employee_calculations' => $employeeCalculations,
        ]);
    }

    /**
     * Approve payroll
     */
    public function approve(Request $request, int $periodId)
    {
        try {
            // TODO: In production, update actual database records
            // For now, simulate success with mock data
            
            // Simulate approval workflow
            $approvalData = [
                'period_id' => $periodId,
                'approved_by' => auth()->user()->id,
                'approved_at' => now(),
                'status' => 'approved',
            ];

            // Log the action (audit trail)
            \Log::info('Payroll approved', $approvalData);

            // Return Inertia response with updated data
            return back()->with('success', 'Payroll approved successfully');
        } catch (\Exception $e) {
            \Log::error('Payroll approval error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to approve payroll: ' . $e->getMessage());
        }
    }

    /**
     * Reject payroll
     */
    public function reject(Request $request, int $periodId)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            // TODO: Implement actual rejection logic
            // - Update payroll period status back to 'calculated'
            // - Record rejection reason
            // - Notify relevant users

            \Log::info('Payroll rejected', [
                'period_id' => $periodId,
                'reason' => $validated['reason'],
                'rejected_by' => auth()->user()->id,
            ]);

            return back()->with('success', 'Payroll rejected successfully');
        } catch (\Exception $e) {
            \Log::error('Payroll rejection error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to reject payroll: ' . $e->getMessage());
        }
    }

    /**
     * Lock payroll (prevent further changes)
     */
    public function lock(Request $request, int $periodId)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        try {
            // TODO: Implement actual lock logic
            // - Set payroll period as locked
            // - Prevent future modifications
            // - Record lock reason and timestamp

            \Log::info('Payroll locked', [
                'period_id' => $periodId,
                'reason' => $validated['reason'] ?? 'No reason provided',
                'locked_by' => auth()->user()->id,
            ]);

            return back()->with('success', 'Payroll locked successfully');
        } catch (\Exception $e) {
            \Log::error('Payroll lock error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to lock payroll: ' . $e->getMessage());
        }
    }

    /**
     * Download payslips
     */
    public function downloadPayslips(Request $request, int $periodId)
    {
        try {
            // Get payroll period and employee calculations
            $payrollPeriod = $this->getMockPayrollPeriodSummary($periodId);
            $employeeCalculations = $this->getMockEmployeeCalculations();

            // Generate payslip data for each employee
            $payslips = [];
            foreach ($employeeCalculations as $employee) {
                $payslips[] = [
                    'employee_id' => $employee['employee_id'],
                    'employee_name' => $employee['employee_name'],
                    'employee_number' => $employee['employee_number'],
                    'department' => $employee['department'],
                    'position' => $employee['position'],
                    'period' => $payrollPeriod['name'],
                    'basic_salary' => $employee['basic_salary'],
                    'gross_pay' => $employee['gross_pay'],
                    'deductions' => $employee['total_deductions'],
                    'net_pay' => $employee['net_pay'],
                    'generated_at' => now()->format('Y-m-d H:i:s'),
                ];
            }

            // Create a filename for the payslip batch
            $timestamp = now()->format('YmdHis');
            $filename = 'payslips_period_' . $periodId . '_' . $timestamp . '.json';
            $filepath = storage_path('app/payslips/' . $filename);

            // Ensure directory exists
            if (!is_dir(dirname($filepath))) {
                mkdir(dirname($filepath), 0755, true);
            }

            // Save payslips data (in production, would generate PDFs)
            file_put_contents($filepath, json_encode($payslips, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            // Log the action
            \Log::info('Payslips generated', [
                'period_id' => $periodId,
                'employee_count' => count($payslips),
                'filename' => $filename,
            ]);

            return back()->with('success', 'Payslips generated successfully. ' . count($payslips) . ' payslips created.');
        } catch (\Exception $e) {
            \Log::error('Payslip generation error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to generate payslips: ' . $e->getMessage());
        }
    }

    // =====================================================================
    // MOCK DATA METHODS
    // =====================================================================

    private function getMockPayrollPeriodSummary(int $periodId)
    {
        return [
            'id' => $periodId,
            'name' => 'November 2025 - 2nd Half',
            'period_type' => 'semi_monthly',
            'start_date' => '2025-11-16',
            'end_date' => '2025-11-30',
            'pay_date' => '2025-12-05',
            'status' => 'reviewing',
            'total_employees' => 125,
            'total_gross_pay' => 4250000.00,
            'total_deductions' => 1050000.00,
            'total_net_pay' => 3200000.00,
        ];
    }

    private function getMockSummary(int $periodId)
    {
        return [
            'total_employees_processed' => 125,
            'total_gross_pay' => 4250000.00,
            'total_statutory_deductions' => 750000.00,
            'total_other_deductions' => 300000.00,
            'total_deductions' => 1050000.00,
            'total_net_pay' => 3200000.00,
            'total_employer_cost' => 4650000.00,
            'variance_from_previous' => 210000.00,
            'variance_percentage' => '+5.2%',
            'previous_period_net_pay' => 2990000.00,
            'formatted_gross_pay' => '₱4,250,000.00',
            'formatted_deductions' => '₱1,050,000.00',
            'formatted_net_pay' => '₱3,200,000.00',
            'formatted_employer_cost' => '₱4,650,000.00',
            'formatted_variance' => '+₱210,000.00',
        ];
    }

    private function getMockDepartmentBreakdown()
    {
        return [
            [
                'id' => 1,
                'name' => 'Engineering',
                'employee_count' => 35,
                'total_gross_pay' => 1500000.00,
                'total_deductions' => 350000.00,
                'total_net_pay' => 1150000.00,
                'total_employer_cost' => 1620000.00,
                'percentage_of_total' => 35.3,
                'average_gross_per_employee' => 42857.14,
                'average_net_per_employee' => 32857.14,
                'formatted_gross_pay' => '₱1,500,000.00',
                'formatted_net_pay' => '₱1,150,000.00',
                'formatted_employer_cost' => '₱1,620,000.00',
            ],
            [
                'id' => 2,
                'name' => 'Operations',
                'employee_count' => 45,
                'total_gross_pay' => 1650000.00,
                'total_deductions' => 400000.00,
                'total_net_pay' => 1250000.00,
                'total_employer_cost' => 1785000.00,
                'percentage_of_total' => 38.8,
                'average_gross_per_employee' => 36666.67,
                'average_net_per_employee' => 27777.78,
                'formatted_gross_pay' => '₱1,650,000.00',
                'formatted_net_pay' => '₱1,250,000.00',
                'formatted_employer_cost' => '₱1,785,000.00',
            ],
            [
                'id' => 3,
                'name' => 'Administration',
                'employee_count' => 25,
                'total_gross_pay' => 800000.00,
                'total_deductions' => 200000.00,
                'total_net_pay' => 600000.00,
                'total_employer_cost' => 865000.00,
                'percentage_of_total' => 18.8,
                'average_gross_per_employee' => 32000.00,
                'average_net_per_employee' => 24000.00,
                'formatted_gross_pay' => '₱800,000.00',
                'formatted_net_pay' => '₱600,000.00',
                'formatted_employer_cost' => '₱865,000.00',
            ],
            [
                'id' => 4,
                'name' => 'Finance',
                'employee_count' => 20,
                'total_gross_pay' => 300000.00,
                'total_deductions' => 100000.00,
                'total_net_pay' => 200000.00,
                'total_employer_cost' => 380000.00,
                'percentage_of_total' => 7.1,
                'average_gross_per_employee' => 15000.00,
                'average_net_per_employee' => 10000.00,
                'formatted_gross_pay' => '₱300,000.00',
                'formatted_net_pay' => '₱200,000.00',
                'formatted_employer_cost' => '₱380,000.00',
            ],
        ];
    }

    private function getMockExceptions()
    {
        return [
            [
                'id' => 1,
                'type' => 'high_variance',
                'severity' => 'warning',
                'title' => 'High Net Pay Variance',
                'description' => 'Net pay increased by 15% compared to previous period',
                'employee_id' => 5,
                'employee_name' => 'Juan Dela Cruz',
                'employee_number' => 'EMP-005',
                'department' => 'Engineering',
                'affected_amount' => 15000.00,
                'formatted_amount' => '₱15,000.00',
                'previous_value' => 50000.00,
                'current_value' => 65000.00,
                'variance_percentage' => '+30%',
                'action_required' => true,
                'action_description' => 'Review overtime hours and allowances',
            ],
            [
                'id' => 2,
                'type' => 'new_hire',
                'severity' => 'info',
                'title' => 'New Hire',
                'description' => 'First payroll for this employee',
                'employee_id' => 15,
                'employee_name' => 'Maria Santos',
                'employee_number' => 'EMP-015',
                'department' => 'Operations',
                'affected_amount' => 35000.00,
                'formatted_amount' => '₱35,000.00',
                'action_required' => false,
            ],
            [
                'id' => 3,
                'type' => 'tax_anomaly',
                'severity' => 'warning',
                'title' => 'Tax Computation Anomaly',
                'description' => 'Withholding tax appears unusually high',
                'employee_id' => 8,
                'employee_name' => 'Pedro Reyes',
                'employee_number' => 'EMP-008',
                'department' => 'Engineering',
                'affected_amount' => 2500.00,
                'formatted_amount' => '₱2,500.00',
                'action_required' => true,
                'action_description' => 'Verify tax status and exemptions',
            ],
        ];
    }

    private function getMockApprovalWorkflow(int $periodId)
    {
        return [
            'id' => 1,
            'payroll_period_id' => $periodId,
            'current_step' => 2,
            'total_steps' => 3,
            'status' => 'in_progress',
            'can_approve' => true,
            'can_reject' => true,
            'approver_role' => 'Payroll Manager',
            'steps' => [
                [
                    'step_number' => 1,
                    'role' => 'Payroll Officer',
                    'status' => 'approved',
                    'status_label' => 'Approved',
                    'status_color' => 'green',
                    'description' => 'Calculate and review payroll calculations',
                    'approved_by' => 'Maria Santos',
                    'approved_at' => '2025-11-30 10:30:00',
                    'comments' => 'All calculations verified and correct',
                ],
                [
                    'step_number' => 2,
                    'role' => 'Payroll Manager',
                    'status' => 'pending',
                    'status_label' => 'Pending',
                    'status_color' => 'yellow',
                    'description' => 'Review and approve payroll for processing',
                    'approved_by' => null,
                    'approved_at' => null,
                    'comments' => null,
                ],
                [
                    'step_number' => 3,
                    'role' => 'Finance Director',
                    'status' => 'pending',
                    'status_label' => 'Pending',
                    'status_color' => 'gray',
                    'description' => 'Final authorization for payroll release',
                    'approved_by' => null,
                    'approved_at' => null,
                    'comments' => null,
                ],
            ],
            'rejection_reason' => null,
            'rejection_date' => null,
            'rejection_by' => null,
        ];
    }

    private function getMockEmployeeCalculations()
    {
        $employees = [
            ['id' => 1, 'name' => 'Juan Dela Cruz', 'number' => 'EMP-001', 'dept' => 'Engineering', 'pos' => 'Senior Engineer'],
            ['id' => 2, 'name' => 'Maria Garcia', 'number' => 'EMP-002', 'dept' => 'Operations', 'pos' => 'Operations Manager'],
            ['id' => 3, 'name' => 'Pedro Reyes', 'number' => 'EMP-003', 'dept' => 'Engineering', 'pos' => 'Mechanical Engineer'],
            ['id' => 4, 'name' => 'Ana Santos', 'number' => 'EMP-004', 'dept' => 'Administration', 'pos' => 'HR Specialist'],
            ['id' => 5, 'name' => 'Carlos Lopez', 'number' => 'EMP-005', 'dept' => 'Finance', 'pos' => 'Financial Analyst'],
        ];

        return array_map(function ($emp) {
            return [
                'id' => $emp['id'],
                'employee_id' => $emp['id'],
                'employee_name' => $emp['name'],
                'employee_number' => $emp['number'],
                'department' => $emp['dept'],
                'position' => $emp['pos'],
                'basic_salary' => 50000,
                'gross_pay' => 52500,
                'statutory_deductions' => 4500,
                'other_deductions' => 500,
                'total_deductions' => 5000,
                'net_pay' => 47500,
                'has_adjustments' => $emp['id'] === 5,
                'has_errors' => false,
                'error_message' => null,
                'formatted_gross_pay' => '₱52,500.00',
                'formatted_net_pay' => '₱47,500.00',
            ];
        }, $employees);
    }
}
