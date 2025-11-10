<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Requests\HR\StorePositionRequest;
use App\Http\Requests\HR\UpdatePositionRequest;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $positions = Position::query()
            ->orderBy('title')
            ->get()
            ->map(function (Position $pos) {
                return [
                    'id' => $pos->id,
                    'title' => $pos->title,
                    'code' => (string) ($pos->code ?? ''),
                    'description' => $pos->description,
                    'department_id' => $pos->department_id,
                    'reports_to' => $pos->reports_to,
                    // map DB fields to UI expectations
                    'salary_min' => $pos->min_salary,
                    'salary_max' => $pos->max_salary,
                    'is_active' => (bool) $pos->is_active,
                ];
            });

        $departments = Department::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code'])
            ->map(function ($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => (string) ($dept->code ?? ''),
                ];
            });

        $stats = [
            'total' => Position::count(),
            'active' => Position::where('is_active', true)->count(),
            'inactive' => Position::where('is_active', false)->count(),
        ];

        return Inertia::render('HR/Positions/Index', [
            'positions' => $positions,
            'departments' => $departments,
            'statistics' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePositionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Map UI field names to DB columns
        $mapped = [
            'title' => $data['title'],
            'code' => $data['code'] ?? null,
            'description' => $data['description'] ?? null,
            'department_id' => $data['department_id'],
            'reports_to' => $data['reports_to'] ?? null,
            'min_salary' => $data['salary_min'] ?? null,
            'max_salary' => $data['salary_max'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ];

        Position::create($mapped);

        return back()->with('success', 'Position created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePositionRequest $request, Position $position): RedirectResponse
    {
        $data = $request->validated();

        $mapped = [
            'title' => $data['title'],
            'code' => $data['code'] ?? null,
            'description' => $data['description'] ?? null,
            'department_id' => $data['department_id'],
            'reports_to' => $data['reports_to'] ?? null,
            'min_salary' => $data['salary_min'] ?? null,
            'max_salary' => $data['salary_max'] ?? null,
            'is_active' => $data['is_active'] ?? $position->is_active,
        ];

        $position->update($mapped);

        return back()->with('success', 'Position updated successfully.');
    }

    /**
     * Remove the specified resource from storage (soft delete / archive).
     */
    public function destroy(Position $position): RedirectResponse
    {
        // Optional: prevent delete if has employees assigned (if relation exists)
        if (method_exists($position, 'employees') && $position->employees()->exists()) {
            return back()->with('error', 'Cannot archive position with employees.');
        }

        $position->delete();

        return back()->with('success', 'Position archived successfully.');
    }
}
