<?php

namespace App\Http\Controllers\Payroll\Government;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Log;

class BIRController extends Controller
{
    /**
     * Display BIR Reports page
     */
    public function index(Request $request)
    {
        $reports = $this->getMockBIRReports();
        $periods = $this->getMockPayrollPeriods();
        $summary = $this->getMockBIRSummary();
        $generatedReports = $this->getMockGeneratedReports();

        return Inertia::render('Payroll/Government/BIR/Index', [
            'reports' => $reports,
            'periods' => $periods,
            'summary' => $summary,
            'generated_reports' => $generatedReports,
        ]);
    }

    /**
     * Generate BIR Form 1601C (Monthly Remittance)
     */
    public function generate1601C(Request $request, int $periodId)
    {
        try {
            $validated = $request->validate([
                'rdo_code' => 'required|string',
            ]);

            // Mock data generation
            $form1601C = $this->generateMock1601CData($periodId, $validated['rdo_code']);

            Log::info('BIR Form 1601C generated', [
                'period_id' => $periodId,
                'rdo_code' => $validated['rdo_code'],
                'generated_by' => auth()->user()->id,
            ]);

            return back()->with('success', 'Form 1601C generated successfully');
        } catch (\Exception $e) {
            Log::error('Form 1601C generation error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to generate Form 1601C: ' . $e->getMessage());
        }
    }

    /**
     * Generate BIR Form 2316 (Annual Certificate)
     */
    public function generate2316(Request $request, int $periodId)
    {
        try {
            $form2316Data = $this->generateMock2316Data($periodId);

            Log::info('BIR Form 2316 certificates generated', [
                'period_id' => $periodId,
                'employee_count' => count($form2316Data['certificates']),
                'generated_by' => auth()->user()->id,
            ]);

            return back()->with('success', 'Form 2316 certificates generated successfully for all employees');
        } catch (\Exception $e) {
            Log::error('Form 2316 generation error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to generate Form 2316: ' . $e->getMessage());
        }
    }

    /**
     * Generate BIR Alphalist (DAT Format)
     */
    public function generateAlphalist(Request $request, int $periodId)
    {
        try {
            $alphalistData = $this->generateMockAlphalistData($periodId);

            Log::info('BIR Alphalist generated', [
                'period_id' => $periodId,
                'employee_count' => count($alphalistData['employees']),
                'generated_by' => auth()->user()->id,
            ]);

            return back()->with('success', 'Alphalist generated successfully in DAT format');
        } catch (\Exception $e) {
            Log::error('Alphalist generation error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to generate Alphalist: ' . $e->getMessage());
        }
    }

    /**
     * Download Form 1601C file
     */
    public function download1601C(Request $request, $periodId)
    {
        try {
            $taxYear = date('Y');
            $fileName = "BIR_1601C_Period_{$periodId}_{$taxYear}.pdf";

            // Generate mock PDF content
            $fileContent = $this->generateMock1601CPDF($periodId);

            return response($fileContent, 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Content-Length', strlen($fileContent));
        } catch (\Exception $e) {
            Log::error('Form 1601C download error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors('Failed to download Form 1601C: ' . $e->getMessage());
        }
    }

    /**
     * Download Form 2316 certificates
     */
    public function download2316(Request $request, $periodId)
    {
        try {
            $taxYear = date('Y');
            $fileName = "BIR_2316_Certificates_{$taxYear}.zip";

            // Generate mock ZIP content
            $fileContent = $this->generateMock2316ZIP($periodId);

            return response($fileContent, 200)
                ->header('Content-Type', 'application/zip')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Content-Length', strlen($fileContent));
        } catch (\Exception $e) {
            Log::error('Form 2316 download error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors('Failed to download Form 2316 certificates: ' . $e->getMessage());
        }
    }

    /**
     * Download Alphalist DAT file
     */
    public function downloadAlphalist(Request $request, $periodId)
    {
        try {
            $taxYear = date('Y');
            $fileName = "BIR_ALPHALIST_{$taxYear}.dat";

            $fileContent = $this->generateMockAlphalistDAT($periodId);

            return response($fileContent, 200)
                ->header('Content-Type', 'text/plain')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Content-Length', strlen($fileContent));
        } catch (\Exception $e) {
            Log::error('Alphalist download error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors('Failed to download Alphalist: ' . $e->getMessage());
        }
    }

    /**
     * Submit Form 1601C to BIR
     */
    public function submit1601C(Request $request, int $periodId)
    {
        try {
            // Mock submission to BIR eFPS
            $submissionData = [
                'period_id' => $periodId,
                'report_type' => '1601C',
                'submitted_by' => auth()->user()->id,
                'submitted_at' => now(),
                'submission_status' => 'submitted',
                'reference_number' => 'BIR' . date('YmdHis') . rand(1000, 9999),
            ];

            Log::info('BIR Form 1601C submitted', $submissionData);

            return back()->with('success', 'Form 1601C submitted to BIR successfully');
        } catch (\Exception $e) {
            Log::error('Form 1601C submission error', [
                'period_id' => $periodId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to submit Form 1601C: ' . $e->getMessage());
        }
    }

    /**
     * Download report file
     */
    public function download(Request $request, $reportId)
    {
        try {
            // Get the mock generated reports to determine type
            $generatedReports = $this->getMockGeneratedReports();
            $report = collect($generatedReports)->firstWhere('id', $reportId);

            if (!$report) {
                return back()->withErrors('Report not found');
            }

            // Determine content type and file extension based on report type
            $reportType = $report['report_type'];
            $fileName = $report['file_name'];
            
            if ($reportType === '1601C') {
                $fileContent = $this->generateMock1601CPDF($reportId);
                $contentType = 'application/pdf';
            } elseif ($reportType === '2316') {
                $fileContent = $this->generateMock2316ZIP($reportId);
                $contentType = 'application/zip';
            } elseif ($reportType === 'Alphalist') {
                $fileContent = $this->generateMockAlphalistDAT($reportId);
                $contentType = 'text/plain';
            } else {
                $fileContent = $this->generateMockPDF($reportId);
                $contentType = 'application/pdf';
            }

            Log::info('Report downloaded', [
                'report_id' => $reportId,
                'report_type' => $reportType,
                'file_name' => $fileName,
                'downloaded_by' => auth()->user()->id,
            ]);

            return response($fileContent, 200)
                ->header('Content-Type', $contentType)
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Content-Length', strlen($fileContent));
        } catch (\Exception $e) {
            Log::error('Report download error', [
                'report_id' => $reportId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors('Failed to download report: ' . $e->getMessage());
        }
    }

    /**
     * Submit report to BIR
     */
    public function submit(Request $request, $reportId)
    {
        try {
            Log::info('BIR report submitted', [
                'report_id' => $reportId,
                'submitted_by' => auth()->user()->id,
            ]);

            return back()->with('success', 'Report submitted to BIR successfully');
        } catch (\Exception $e) {
            Log::error('Report submission error', [
                'report_id' => $reportId,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to submit report: ' . $e->getMessage());
        }
    }

    // ============================================================================
    // MOCK DATA GENERATORS
    // ============================================================================

    private function getMockBIRReports(): array
    {
        return [
            [
                'id' => 1,
                'type' => '1601C',
                'period_id' => 1,
                'period_name' => 'October 2025 - 1st Half',
                'status' => 'generated',
                'generated_at' => '2025-10-20 14:30:00',
                'submitted_at' => '2025-10-22 09:15:00',
                'file_name' => 'BIR_1601C_Period_1_2025.pdf',
                'file_size' => 250000,
                'employee_count' => 185,
                'total_amount' => 2850000,
                'created_at' => '2025-10-20 14:30:00',
                'updated_at' => '2025-10-22 09:15:00',
            ],
            [
                'id' => 2,
                'type' => '2316',
                'period_id' => 1,
                'period_name' => 'October 2025 - 1st Half',
                'status' => 'draft',
                'generated_at' => null,
                'submitted_at' => null,
                'file_name' => null,
                'file_size' => null,
                'employee_count' => 185,
                'total_amount' => 3200000,
                'created_at' => '2025-10-20 14:30:00',
                'updated_at' => '2025-10-20 14:30:00',
            ],
            [
                'id' => 3,
                'type' => 'Alphalist',
                'period_id' => 1,
                'period_name' => 'October 2025 - 1st Half',
                'status' => 'ready',
                'generated_at' => '2025-10-19 10:45:00',
                'submitted_at' => null,
                'file_name' => 'BIR_ALPHALIST_2025.dat',
                'file_size' => 125000,
                'employee_count' => 185,
                'total_amount' => 3200000,
                'created_at' => '2025-10-19 10:45:00',
                'updated_at' => '2025-10-19 10:45:00',
            ],
        ];
    }

    private function getMockPayrollPeriods(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'October 2025 - 1st Half',
                'start_date' => '2025-10-01',
                'end_date' => '2025-10-15',
                'status' => 'approved',
            ],
            [
                'id' => 2,
                'name' => 'October 2025 - 2nd Half',
                'start_date' => '2025-10-16',
                'end_date' => '2025-10-31',
                'status' => 'calculated',
            ],
            [
                'id' => 3,
                'name' => 'November 2025',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-30',
                'status' => 'draft',
            ],
        ];
    }

    private function getMockBIRSummary(): array
    {
        return [
            'total_employees' => 185,
            'total_gross_compensation' => 8500000,
            'total_withholding_tax' => 1105000,
            'reports_generated_count' => 3,
            'reports_submitted_count' => 1,
            'last_submission_date' => '2025-10-22',
            'next_deadline' => '2025-11-10',
        ];
    }

    private function getMockGeneratedReports(): array
    {
        return [
            [
                'id' => 1,
                'report_type' => '1601C',
                'period' => 'October 2025 - 1st Half',
                'file_name' => 'BIR_1601C_Period_1_2025.pdf',
                'file_path' => 'reports/bir/1601c/BIR_1601C_Period_1_2025.pdf',
                'file_size' => 250000,
                'generated_at' => '2025-10-20T14:30:00',
                'submitted' => true,
                'submission_status' => 'submitted',
                'rejection_reason' => null,
            ],
            [
                'id' => 2,
                'report_type' => 'Alphalist',
                'period' => 'October 2025 - 1st Half',
                'file_name' => 'BIR_ALPHALIST_2025.dat',
                'file_path' => 'reports/bir/alphalist/BIR_ALPHALIST_2025.dat',
                'file_size' => 125000,
                'generated_at' => '2025-10-19T10:45:00',
                'submitted' => false,
                'submission_status' => 'pending',
                'rejection_reason' => null,
            ],
        ];
    }

    private function generateMock1601CData($periodId, $rdoCode): array
    {
        return [
            'period_id' => $periodId,
            'rdo_code' => $rdoCode,
            'company_tin' => '123456789010',
            'company_name' => 'Cathay Metal Corporation',
            'reporting_month' => 'October 2025',
            'total_employees' => 185,
            'total_compensation' => 2850000,
            'total_withholding_tax' => 370500,
            'generated_at' => now(),
        ];
    }

    private function generateMock2316Data($periodId): array
    {
        $employees = [
            ['employee_id' => 'EMP001', 'name' => 'Juan Dela Cruz', 'tin' => '123456789012', 'gross' => 540000, 'tax_withheld' => 64350],
            ['employee_id' => 'EMP002', 'name' => 'Maria Santos', 'tin' => '123456789013', 'gross' => 660000, 'tax_withheld' => 79650],
            ['employee_id' => 'EMP003', 'name' => 'Pedro Reyes', 'tin' => '123456789014', 'gross' => 456000, 'tax_withheld' => 50340],
            ['employee_id' => 'EMP004', 'name' => 'Rosa Garcia', 'tin' => '123456789015', 'gross' => 504000, 'tax_withheld' => 60480],
            ['employee_id' => 'EMP005', 'name' => 'Carlos Morales', 'tin' => '123456789016', 'gross' => 624000, 'tax_withheld' => 74360],
        ];

        $certificates = array_map(fn ($emp) => [
            'employee_id' => $emp['employee_id'],
            'tin' => $emp['tin'],
            'employee_name' => $emp['name'],
            'gross_compensation' => $emp['gross'],
            'non_taxable_compensation' => floor($emp['gross'] * 0.08),
            'taxable_compensation' => floor($emp['gross'] * 0.92),
            'tax_withheld' => $emp['tax_withheld'],
        ], $employees);

        return [
            'period_id' => $periodId,
            'tax_year' => date('Y'),
            'total_certificates' => count($certificates),
            'total_gross_compensation' => array_sum(array_column($certificates, 'gross_compensation')),
            'total_tax_withheld' => array_sum(array_column($certificates, 'tax_withheld')),
            'certificates' => $certificates,
            'generated_at' => now(),
        ];
    }

    private function generateMockAlphalistData($periodId): array
    {
        $employees = [
            ['employee_id' => 'EMP001', 'name' => 'Juan Dela Cruz', 'tin' => '123456789012', 'annual_gross' => 540000],
            ['employee_id' => 'EMP002', 'name' => 'Maria Santos', 'tin' => '123456789013', 'annual_gross' => 660000],
            ['employee_id' => 'EMP003', 'name' => 'Pedro Reyes', 'tin' => '123456789014', 'annual_gross' => 456000],
            ['employee_id' => 'EMP004', 'name' => 'Rosa Garcia', 'tin' => '123456789015', 'annual_gross' => 504000],
            ['employee_id' => 'EMP005', 'name' => 'Carlos Morales', 'tin' => '123456789016', 'annual_gross' => 624000],
        ];

        $alphalist = array_map(fn ($emp, $idx) => [
            'sequence_number' => $idx + 1,
            'tin' => $emp['tin'],
            'employee_name' => $emp['name'],
            'address' => 'Manila, Philippines',
            'birth_date' => '1990-01-15',
            'gender' => $idx % 2 === 0 ? 'M' : 'F',
            'civil_status' => 'Married',
            'annual_gross_compensation' => $emp['annual_gross'],
            'annual_non_taxable_compensation' => floor($emp['annual_gross'] * 0.08),
            'annual_taxable_compensation' => floor($emp['annual_gross'] * 0.92),
            'annual_tax_withheld' => floor($emp['annual_gross'] * 0.13),
            'status_flag' => 'Active',
        ], $employees, array_keys($employees));

        return [
            'period_id' => $periodId,
            'tax_year' => date('Y'),
            'total_employees' => count($alphalist),
            'total_gross_compensation' => array_sum(array_column($alphalist, 'annual_gross_compensation')),
            'total_tax_withheld' => array_sum(array_column($alphalist, 'annual_tax_withheld')),
            'employees' => $alphalist,
            'generated_at' => now(),
        ];
    }

    private function generateMock1601CPDF($reportId): string
    {
        $taxYear = date('Y');
        $month = 'October';
        $companyTin = '123456789010';
        $companyName = 'Cathay Metal Corporation';
        
        // Create a more realistic PDF-like content
        $content = <<<PDF
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< >>
stream
BT
/F1 12 Tf
50 750 Td
(BIR FORM 1601-C) Tj
0 -20 Td
(MONTHLY REMITTANCE RETURN OF INCOME TAX WITHHELD) Tj
0 -40 Td
(Month: $month $taxYear) Tj
0 -20 Td
(Company TIN: $companyTin) Tj
0 -20 Td
(Company Name: $companyName) Tj
0 -40 Td
(Total Employees Withheld From: 185) Tj
0 -20 Td
(Total Compensation: 2,850,000.00) Tj
0 -20 Td
(Total Tax Withheld: 371,000.00) Tj
0 -20 Td
(Average Tax Rate: 13.02%) Tj
0 -40 Td
(This is a placeholder PDF generated from mock data.) Tj
0 -20 Td
(In production, actual PDF library will be used.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
500
%%EOF
PDF;

        return $content;
    }

    private function generateMock2316ZIP($reportId): string
    {
        // Create a structured text file for BIR 2316 certificates
        $taxYear = date('Y');
        $employees = [
            ['name' => 'Juan Dela Cruz', 'tin' => '123456789012', 'gross' => 540000, 'non_taxable' => 45000, 'taxable' => 495000, 'withheld' => 64350],
            ['name' => 'Maria Santos', 'tin' => '123456789013', 'gross' => 660000, 'non_taxable' => 55000, 'taxable' => 605000, 'withheld' => 79650],
            ['name' => 'Pedro Reyes', 'tin' => '123456789014', 'gross' => 456000, 'non_taxable' => 38000, 'taxable' => 418000, 'withheld' => 50340],
            ['name' => 'Rosa Garcia', 'tin' => '123456789015', 'gross' => 504000, 'non_taxable' => 42000, 'taxable' => 462000, 'withheld' => 60480],
            ['name' => 'Carlos Morales', 'tin' => '123456789016', 'gross' => 624000, 'non_taxable' => 52000, 'taxable' => 572000, 'withheld' => 74360],
        ];

        $zipContent = "================================================================================\n";
        $zipContent .= "BIR FORM 2316 - CERTIFICATE OF COMPENSATION INCOME WITHHELD ON WAGES\n";
        $zipContent .= "================================================================================\n\n";
        
        $zipContent .= "Company Name:        Cathay Metal Corporation\n";
        $zipContent .= "Company TIN:         123456789010\n";
        $zipContent .= "Tax Year:            {$taxYear}\n";
        $zipContent .= "Total Certificates:  " . count($employees) . "\n";
        $zipContent .= "Generated:           " . now()->format('F d, Y H:i:s A') . "\n";
        $zipContent .= "\n";
        
        $totalGross = 0;
        $totalTaxable = 0;
        $totalWithheld = 0;
        
        foreach ($employees as $index => $emp) {
            $totalGross += $emp['gross'];
            $totalTaxable += $emp['taxable'];
            $totalWithheld += $emp['withheld'];
            
            $certNum = $index + 1;
            $zipContent .= "================================================================================\n";
            $zipContent .= "CERTIFICATE #{$certNum}\n";
            $zipContent .= "================================================================================\n";
            $zipContent .= "Employee Name:                    " . str_pad($emp['name'], 40) . "\n";
            $zipContent .= "Tax Identification Number (TIN):  " . $emp['tin'] . "\n";
            $zipContent .= "Annual Gross Compensation:        ₱" . number_format($emp['gross'], 2) . "\n";
            $zipContent .= "Non-Taxable Compensation:         ₱" . number_format($emp['non_taxable'], 2) . "\n";
            $zipContent .= "Taxable Compensation:             ₱" . number_format($emp['taxable'], 2) . "\n";
            $zipContent .= "Total Tax Withheld:               ₱" . number_format($emp['withheld'], 2) . "\n";
            $zipContent .= "Tax Rate:                         " . number_format(($emp['withheld'] / $emp['gross'] * 100), 2) . "%\n";
            $zipContent .= "\n";
        }
        
        $zipContent .= "================================================================================\n";
        $zipContent .= "SUMMARY\n";
        $zipContent .= "================================================================================\n";
        $zipContent .= "Total Certificates:              " . count($employees) . "\n";
        $zipContent .= "Total Gross Compensation:        ₱" . number_format($totalGross, 2) . "\n";
        $zipContent .= "Total Taxable Compensation:      ₱" . number_format($totalTaxable, 2) . "\n";
        $zipContent .= "Total Tax Withheld:              ₱" . number_format($totalWithheld, 2) . "\n";
        $zipContent .= "Average Tax Rate:                " . number_format(($totalWithheld / $totalGross * 100), 2) . "%\n";
        $zipContent .= "\n";
        $zipContent .= "This is an official BIR Form 2316 summary document.\n";
        $zipContent .= "For production use, actual PDF certificates should be generated for each employee.\n";

        return $zipContent;
    }

    private function generateMockAlphalistDAT($periodId): string
    {
        $alphalist = $this->generateMockAlphalistData($periodId);
        
        // Header section with metadata
        $datContent = "BIR ALPHALIST OF EMPLOYEES RECEIVING COMPENSATION\n";
        $datContent .= "Tax Year: " . date('Y') . "\n";
        $datContent .= "Company TIN: 123456789010\n";
        $datContent .= "Company Name: Cathay Metal Corporation\n";
        $datContent .= "Generated: " . now()->format('F d, Y H:i:s A') . "\n";
        $datContent .= str_repeat("=", 180) . "\n\n";
        
        // DAT file format with pipe delimiters and enhanced formatting
        $datContent .= "SEQUENCE|TIN|EMPLOYEE_NAME|ADDRESS|BIRTH_DATE|GENDER|CIVIL_STATUS|ANNUAL_GROSS|ANNUAL_NON_TAXABLE|ANNUAL_TAXABLE|ANNUAL_TAX_WITHHELD|TAX_RATE|STATUS\n";
        $datContent .= str_repeat("-", 180) . "\n";
        
        $totalGross = 0;
        $totalTaxable = 0;
        $totalTax = 0;

        foreach ($alphalist['employees'] as $emp) {
            $taxRate = ($emp['annual_gross_compensation'] > 0) 
                ? number_format(($emp['annual_tax_withheld'] / $emp['annual_gross_compensation'] * 100), 2) 
                : '0.00';
            
            $datContent .= sprintf(
                "%d|%s|%s|%s|%s|%s|%s|%.2f|%.2f|%.2f|%.2f|%s%%|%s\n",
                $emp['sequence_number'],
                $emp['tin'],
                $emp['employee_name'],
                $emp['address'],
                $emp['birth_date'],
                $emp['gender'],
                $emp['civil_status'],
                $emp['annual_gross_compensation'],
                $emp['annual_non_taxable_compensation'],
                $emp['annual_taxable_compensation'],
                $emp['annual_tax_withheld'],
                $taxRate,
                $emp['status_flag']
            );
            
            $totalGross += $emp['annual_gross_compensation'];
            $totalTaxable += $emp['annual_taxable_compensation'];
            $totalTax += $emp['annual_tax_withheld'];
        }
        
        // Add summary section
        $datContent .= str_repeat("-", 180) . "\n";
        $datContent .= "SUMMARY:\n";
        $datContent .= "Total Employees: " . count($alphalist['employees']) . "\n";
        $datContent .= "Total Gross Compensation: ₱" . number_format($totalGross, 2) . "\n";
        $datContent .= "Total Taxable Compensation: ₱" . number_format($totalTaxable, 2) . "\n";
        $datContent .= "Total Tax Withheld: ₱" . number_format($totalTax, 2) . "\n";
        $datContent .= "Average Tax Rate: " . number_format(($totalTax / $totalGross * 100), 2) . "%\n";

        return $datContent;
    }

    private function generateMockPDF($reportId): string
    {
        $taxYear = date('Y');
        
        // Create a simple PDF-like content for generic reports
        $content = <<<PDF
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< >>
stream
BT
/F1 14 Tf
50 750 Td
(BIR REPORT) Tj
0 -20 Td
(Cathay Metal Corporation) Tj
/F1 12 Tf
0 -40 Td
(Report ID: $reportId) Tj
0 -20 Td
(Tax Year: $taxYear) Tj
0 -20 Td
(Generated: ) Tj
0 -40 Td
(This report contains compiled payroll information for Bureau) Tj
0 -20 Td
(of Internal Revenue (BIR) compliance and filing requirements.) Tj
0 -40 Td
(Total Employees: 185) Tj
0 -20 Td
(Total Gross Compensation: 8,500,000.00) Tj
0 -20 Td
(Total Income Tax Withheld: 1,105,000.00) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
600
%%EOF
PDF;

        return $content;
    }
}
