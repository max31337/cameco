<?php

namespace App\Http\Controllers\HR\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use App\Services\HR\EmployeeService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;

class EmployeeExportImportController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * Export employees to CSV
     */
    public function export(): StreamedResponse
    {
        $this->authorize('viewAny', Employee::class);

        $employees = Employee::with('profile', 'department')
            ->orderBy('employee_number')
            ->get();

        $fileName = 'employees_' . date('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($employees) {
            $output = fopen('php://output', 'w');

            // Write header row
            $headers = [
                'Employee Number',
                'First Name',
                'Middle Name',
                'Last Name',
                'Email',
                'Mobile',
                'Department',
                'Position',
                'Employment Type',
                'Status',
                'Date Hired',
                'Gender',
                'Civil Status',
                'Date of Birth',
            ];

            fputcsv($output, $headers);

            // Write data rows
            foreach ($employees as $employee) {
                $position = Position::find($employee->position_id);
                
                fputcsv($output, [
                    $employee->employee_number,
                    $employee->profile?->first_name ?? '',
                    $employee->profile?->middle_name ?? '',
                    $employee->profile?->last_name ?? '',
                    $employee->profile?->email ?? '',
                    $employee->profile?->mobile ?? '',
                    $employee->department?->name ?? '',
                    $position?->title ?? '',
                    $employee->employment_type ?? '',
                    $employee->status ?? '',
                    $employee->date_hired ? date('Y-m-d', strtotime($employee->date_hired)) : '',
                    $employee->profile?->gender ?? '',
                    $employee->profile?->civil_status ?? '',
                    $employee->profile?->date_of_birth ? date('Y-m-d', strtotime($employee->profile->date_of_birth)) : '',
                ]);
            }

            fclose($output);
        }, $fileName, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ]);
    }

    /**
     * Show import page
     */
    public function showImport()
    {
        $this->authorize('create', Employee::class);

        $departments = Department::orderBy('name')->get();
        $positions = Position::orderBy('title')->get();

        return Inertia::render('HR/Employees/Import', [
            'departments' => $departments,
            'positions' => $positions,
        ]);
    }

    /**
     * Import employees from CSV
     */
    public function import(Request $request)
    {
        $this->authorize('create', Employee::class);

        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
        ]);

        try {
            $file = $request->file('file');
            $filePath = $file->getRealPath();
            $fileName = $file->getClientOriginalName();

            $errors = [];
            $imported = 0;
            $skipped = 0;

            // Read CSV file
            $file = fopen($filePath, 'r');
            $header = fgetcsv($file); // Skip header row

            $rowNumber = 1;
            while (($row = fgetcsv($file)) !== false) {
                $rowNumber++;

                // Skip empty rows
                if (count(array_filter($row)) === 0) {
                    continue;
                }

                // Parse row data
                $data = $this->parseEmployeeRow($row, $header, $rowNumber);

                if (!isset($data['success'])) {
                    $errors[] = $data['error'];
                    $skipped++;
                    continue;
                }

                // Try to create/update employee
                try {
                    $result = $this->employeeService->createEmployee($data['data']);
                    
                    if ($result['success']) {
                        $imported++;
                    } else {
                        $errors[] = "Row $rowNumber: " . $result['message'];
                        $skipped++;
                    }
                } catch (\Exception $e) {
                    $errors[] = "Row $rowNumber: " . $e->getMessage();
                    $skipped++;
                }
            }

            fclose($file);

            return response()->json([
                'success' => true,
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
                'message' => "Import completed. {$imported} employees imported, {$skipped} skipped.",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Parse a CSV row into employee data
     */
    private function parseEmployeeRow(array $row, array $headers, int $rowNumber): array
    {
        try {
            // Map CSV columns to array indices
            $data = [];
            foreach ($headers as $index => $header) {
                $data[strtolower(trim($header))] = $row[$index] ?? '';
            }

            // Validate required fields
            if (empty(trim($data['first name'] ?? ''))) {
                return ['error' => "Row $rowNumber: First name is required"];
            }

            if (empty(trim($data['last name'] ?? ''))) {
                return ['error' => "Row $rowNumber: Last name is required"];
            }

            if (empty(trim($data['department'] ?? ''))) {
                return ['error' => "Row $rowNumber: Department is required"];
            }

            if (empty(trim($data['position'] ?? ''))) {
                return ['error' => "Row $rowNumber: Position is required"];
            }

            if (empty(trim($data['date hired'] ?? ''))) {
                return ['error' => "Row $rowNumber: Date hired is required"];
            }

            // Get department ID
            $department = Department::where('name', trim($data['department']))->first();
            if (!$department) {
                return ['error' => "Row $rowNumber: Department '{$data['department']}' not found"];
            }

            // Get position ID
            $position = Position::where('title', trim($data['position']))->first();
            if (!$position) {
                return ['error' => "Row $rowNumber: Position '{$data['position']}' not found"];
            }

            // Parse date
            $dateHired = $this->parseDate($data['date hired']);
            if (!$dateHired) {
                return ['error' => "Row $rowNumber: Invalid date hired format (use YYYY-MM-DD)"];
            }

            return [
                'success' => true,
                'data' => [
                    'first_name' => trim($data['first name']),
                    'middle_name' => trim($data['middle name'] ?? ''),
                    'last_name' => trim($data['last name']),
                    'email' => trim($data['email'] ?? ''),
                    'mobile' => trim($data['mobile'] ?? ''),
                    'department_id' => $department->id,
                    'position_id' => $position->id,
                    'employment_type' => trim($data['employment type'] ?? 'regular'),
                    'status' => trim($data['status'] ?? 'active'),
                    'date_hired' => $dateHired,
                    'gender' => trim($data['gender'] ?? 'male'),
                    'civil_status' => trim($data['civil status'] ?? 'single'),
                    'date_of_birth' => isset($data['date of birth']) && !empty($data['date of birth']) 
                        ? $this->parseDate($data['date of birth']) 
                        : null,
                ],
            ];
        } catch (\Exception $e) {
            return ['error' => "Row $rowNumber: " . $e->getMessage()];
        }
    }

    /**
     * Parse date string to Y-m-d format
     */
    private function parseDate(?string $dateString): ?string
    {
        if (!$dateString || trim($dateString) === '') {
            return null;
        }

        $dateString = trim($dateString);

        // Try common date formats
        $formats = [
            'Y-m-d',
            'Y/m/d',
            'm/d/Y',
            'd/m/Y',
            'm-d-Y',
            'd-m-Y',
            'Y-m-d H:i:s',
        ];

        foreach ($formats as $format) {
            $date = \DateTime::createFromFormat($format, $dateString);
            if ($date && $date->format($format) === $dateString) {
                return $date->format('Y-m-d');
            }
        }

        return null;
    }

    /**
     * Download sample CSV template
     */
    public function downloadTemplate(): StreamedResponse
    {
        $fileName = 'employees_import_template.csv';

        return response()->streamDownload(function () {
            $output = fopen('php://output', 'w');

            // Write header row
            $headers = [
                'Employee Number',
                'First Name',
                'Middle Name',
                'Last Name',
                'Email',
                'Mobile',
                'Department',
                'Position',
                'Employment Type',
                'Status',
                'Date Hired',
                'Gender',
                'Civil Status',
                'Date of Birth',
            ];

            fputcsv($output, $headers);

            // Write sample row
            fputcsv($output, [
                'EMP001',
                'John',
                'Michael',
                'Doe',
                'john.doe@company.com',
                '09123456789',
                'IT',
                'Software Developer',
                'regular',
                'active',
                '2024-01-15',
                'male',
                'single',
                '1990-05-20',
            ]);

            fclose($output);
        }, $fileName, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ]);
    }
}
