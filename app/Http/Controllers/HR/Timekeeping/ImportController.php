<?php

namespace App\Http\Controllers\HR\Timekeeping;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class ImportController extends Controller
{
    /**
     * Display the import management page.
     */
    public function index(Request $request): Response
    {
        $batches = $this->getMockImportBatches();

        // Apply status filter
        if ($request->has('status')) {
            $batches = array_filter($batches, fn($b) => $b['status'] == $request->status);
        }

        // Calculate summary
        $summary = [
            'total_imports' => count($batches),
            'successful' => count(array_filter($batches, fn($b) => $b['status'] === 'completed' && $b['failed_records'] === 0)),
            'failed' => count(array_filter($batches, fn($b) => $b['status'] === 'failed')),
            'pending' => count(array_filter($batches, fn($b) => $b['status'] === 'pending')),
            'records_imported' => array_sum(array_map(fn($b) => $b['successful_records'], $batches)),
        ];

        return Inertia::render('HR/Timekeeping/Import/Index', [
            'batches' => array_values($batches),
            'summary' => $summary,
            'filters' => $request->only(['status', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Handle file upload for import.
     */
    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:10240', // 10MB max
            'import_type' => 'required|in:attendance,overtime,schedule',
        ]);

        // Mock processing
        $batchId = rand(1000, 9999);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully. Processing import...',
            'data' => [
                'batch_id' => $batchId,
                'file_name' => $request->file('file')->getClientOriginalName(),
                'file_size' => $request->file('file')->getSize(),
                'import_type' => $validated['import_type'],
                'status' => 'pending',
                'uploaded_at' => now()->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Process an import batch.
     */
    public function process(int $id): JsonResponse
    {
        // Mock processing result
        $result = [
            'batch_id' => $id,
            'status' => 'completed',
            'total_records' => 150,
            'successful_records' => 142,
            'failed_records' => 8,
            'warnings' => 5,
            'processing_time' => '2.3 seconds',
            'completed_at' => now()->format('Y-m-d H:i:s'),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Import processed successfully',
            'data' => $result,
        ]);
    }

    /**
     * Get import history.
     */
    public function history(Request $request): JsonResponse
    {
        $batches = $this->getMockImportBatches();

        // Apply filters
        if ($request->has('status')) {
            $batches = array_filter($batches, fn($b) => $b['status'] == $request->status);
        }

        return response()->json([
            'success' => true,
            'data' => array_values($batches),
            'total' => count($batches),
        ]);
    }

    /**
     * Get errors for a specific import batch.
     */
    public function errors(int $id): JsonResponse
    {
        $errors = $this->getMockImportErrors($id);

        return response()->json([
            'success' => true,
            'data' => [
                'batch_id' => $id,
                'errors' => $errors,
                'total_errors' => count($errors),
            ],
        ]);
    }

    /**
     * Generate mock import batches.
     */
    private function getMockImportBatches(): array
    {
        $batches = [];
        $statuses = ['pending', 'processing', 'completed', 'failed', 'partial'];
        $types = ['attendance', 'overtime', 'schedule'];

        for ($i = 1; $i <= 10; $i++) {
            $status = $statuses[array_rand($statuses)];
            $totalRecords = rand(50, 200);
            $successRate = $status === 'completed' ? rand(95, 100) : ($status === 'partial' ? rand(70, 94) : 0);
            $successfulRecords = round($totalRecords * ($successRate / 100));
            $failedRecords = $status === 'failed' ? $totalRecords : $totalRecords - $successfulRecords;
            
            $batches[] = [
                'id' => $i,
                'file_name' => 'attendance_import_' . now()->subDays(rand(0, 30))->format('Ymd') . '.csv',
                'file_path' => 'imports/attendance_import_' . $i . '.csv',
                'file_size' => rand(50000, 500000),
                'import_type' => $types[array_rand($types)],
                'total_records' => $totalRecords,
                'processed_records' => $status === 'pending' ? 0 : $totalRecords,
                'successful_records' => $successfulRecords,
                'failed_records' => $failedRecords,
                'warnings' => rand(0, 10),
                'status' => $status,
                'started_at' => $status !== 'pending' ? now()->subDays(rand(0, 30))->format('Y-m-d H:i:s') : null,
                'completed_at' => in_array($status, ['completed', 'failed', 'partial']) ? now()->subDays(rand(0, 30))->format('Y-m-d H:i:s') : null,
                'processing_time' => in_array($status, ['completed', 'partial']) ? rand(1, 30) . ' seconds' : null,
                'error_log' => $status === 'failed' ? 'Invalid file format detected' : null,
                'imported_by' => 'HR Manager',
                'imported_by_name' => 'Admin User',
                'created_at' => now()->subDays(rand(0, 30))->format('Y-m-d H:i:s'),
                'updated_at' => now()->subDays(rand(0, 20))->format('Y-m-d H:i:s'),
            ];
        }

        return $batches;
    }

    /**
     * Generate mock import errors.
     */
    private function getMockImportErrors(int $batchId): array
    {
        $errorTypes = ['invalid_employee', 'invalid_time', 'duplicate_entry', 'validation_error'];
        $errors = [];

        for ($i = 1; $i <= 8; $i++) {
            $errors[] = [
                'id' => $i,
                'import_batch_id' => $batchId,
                'row_number' => rand(1, 200),
                'employee_identifier' => 'EMP' . str_pad(rand(1, 100), 3, '0', STR_PAD_LEFT),
                'error_type' => $errorTypes[array_rand($errorTypes)],
                'error_message' => $this->getErrorMessage($errorTypes[array_rand($errorTypes)]),
                'raw_data' => [
                    'employee_number' => 'EMP' . str_pad(rand(1, 100), 3, '0', STR_PAD_LEFT),
                    'date' => now()->format('Y-m-d'),
                    'time_in' => '08:00:00',
                    'time_out' => '17:00:00',
                ],
                'suggested_fix' => 'Verify employee number exists in system',
                'created_at' => now()->format('Y-m-d H:i:s'),
            ];
        }

        return $errors;
    }

    /**
     * Get error message based on error type.
     */
    private function getErrorMessage(string $errorType): string
    {
        $messages = [
            'invalid_employee' => 'Employee number not found in the system',
            'invalid_time' => 'Time format is invalid. Expected HH:MM:SS',
            'duplicate_entry' => 'Attendance record already exists for this employee and date',
            'validation_error' => 'Time out must be after time in',
        ];

        return $messages[$errorType] ?? 'Unknown error';
    }
}
