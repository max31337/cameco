<?php

namespace App\Http\Controllers\HR\Leave;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeavePolicyController extends Controller
{
    /**
     * Display a listing of leave policies.
     * Shows all available leave types and their annual entitlements.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        // Fetch or define leave policies
        // These would typically come from a LeavePolicy model in ISSUE-5
        $policies = [
            [
                'id' => 1,
                'code' => 'VL',
                'name' => 'Vacation Leave',
                'description' => 'Annual vacation or holiday leave for personal rest and relaxation',
                'annual_entitlement' => 15.0,
                'max_carryover' => 5.0,
                'can_carry_forward' => true,
                'is_paid' => true,
            ],
            [
                'id' => 2,
                'code' => 'SL',
                'name' => 'Sick Leave',
                'description' => 'Leave for illness or medical treatment',
                'annual_entitlement' => 10.0,
                'max_carryover' => 0.0,
                'can_carry_forward' => false,
                'is_paid' => true,
            ],
            [
                'id' => 3,
                'code' => 'EL',
                'name' => 'Emergency Leave',
                'description' => 'Leave for urgent personal or family emergencies',
                'annual_entitlement' => 5.0,
                'max_carryover' => 0.0,
                'can_carry_forward' => false,
                'is_paid' => true,
            ],
            [
                'id' => 4,
                'code' => 'ML',
                'name' => 'Maternity/Paternity Leave',
                'description' => 'Leave for new parents',
                'annual_entitlement' => 90.0,
                'max_carryover' => 0.0,
                'can_carry_forward' => false,
                'is_paid' => true,
            ],
            [
                'id' => 5,
                'code' => 'PL',
                'name' => 'Privilege Leave',
                'description' => 'General personal leave',
                'annual_entitlement' => 8.0,
                'max_carryover' => 2.0,
                'can_carry_forward' => true,
                'is_paid' => true,
            ],
            [
                'id' => 6,
                'code' => 'BL',
                'name' => 'Bereavement Leave',
                'description' => 'Leave for death of a family member',
                'annual_entitlement' => 3.0,
                'max_carryover' => 0.0,
                'can_carry_forward' => false,
                'is_paid' => true,
            ],
            [
                'id' => 7,
                'code' => 'SP',
                'name' => 'Special Leave',
                'description' => 'Leave for special circumstances',
                'annual_entitlement' => 0.0,
                'max_carryover' => 0.0,
                'can_carry_forward' => false,
                'is_paid' => false,
            ],
        ];

        return Inertia::render('HR/Leave/Policies', [
            'policies' => $policies,
            'canEdit' => auth()->user()->can('hr.employees.update'),
        ]);
    }
}
