# Phase 7 Frontend Components - Usage Guide

## Overview
This guide shows how to use the Department and Position components and pages.

---

## 📄 Pages

### Departments Index Page
**Path:** `resources/js/pages/HR/Departments/Index.tsx`

#### Usage
```tsx
import DepartmentIndex from '@/pages/HR/Departments/Index';

// Page receives props from server via Inertia.js
interface DepartmentIndexProps {
    departments: Department[];
    statistics?: {
        total?: number;
        active?: number;
        inactive?: number;
    };
}
```

#### Route Setup (in web.php)
```php
Route::get('/hr/departments', [DepartmentController::class, 'index'])->name('hr.departments.index');
Route::post('/hr/departments', [DepartmentController::class, 'store'])->name('hr.departments.store');
Route::put('/hr/departments/{id}', [DepartmentController::class, 'update'])->name('hr.departments.update');
Route::delete('/hr/departments/{id}', [DepartmentController::class, 'destroy'])->name('hr.departments.destroy');
```

#### Features
- Hierarchical tree view with expand/collapse
- Create new department button
- Inline edit, add child, and archive actions
- Statistics showing total, active, and inactive counts
- Parent department filtering when editing

---

### Positions Index Page
**Path:** `resources/js/pages/HR/Positions/Index.tsx`

#### Usage
```tsx
import PositionIndex from '@/pages/HR/Positions/Index';

// Page receives props from server via Inertia.js
interface PositionIndexProps {
    positions: Position[];
    departments: Department[];
    statistics?: {
        total?: number;
        active?: number;
        inactive?: number;
    };
}
```

#### Route Setup (in web.php)
```php
Route::get('/hr/positions', [PositionController::class, 'index'])->name('hr.positions.index');
Route::post('/hr/positions', [PositionController::class, 'store'])->name('hr.positions.store');
Route::put('/hr/positions/{id}', [PositionController::class, 'update'])->name('hr.positions.update');
Route::delete('/hr/positions/{id}', [PositionController::class, 'destroy'])->name('hr.positions.destroy');
```

#### Features
- Positions grouped by department
- Department filter buttons
- Table view with salary range and reporting structure
- Create new position button
- Inline edit and archive actions
- Statistics showing total, active, and inactive counts

---

## 🧩 Components

### DepartmentFormModal
**Path:** `resources/js/components/hr/department-form-modal.tsx`

#### Standalone Usage
```tsx
import { DepartmentFormModal } from '@/components/hr/department-form-modal';
import { useState } from 'react';

export function MyComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const departments = [...]; // your departments

    const handleSubmit = async (data) => {
        // Call your API or use router.post/put
        await axios.post('/api/departments', data);
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)}>Add Department</button>
            
            <DepartmentFormModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleSubmit}
                departments={departments}
                mode="create"
            />
        </>
    );
}
```

#### Props
```typescript
interface DepartmentFormModalProps {
    isOpen: boolean;                    // Control modal visibility
    onClose: () => void;                // Called when modal closes
    onSubmit: (data: Omit<Department, 'id' | 'employee_count'>) 
        => Promise<void>;               // Called when form submits
    department?: Department | null;     // Current department (for edit mode)
    departments?: Department[];         // All departments (for parent dropdown)
    mode?: 'create' | 'edit';          // Form mode
}
```

#### Exported Types
```typescript
export interface Department {
    id: number;
    name: string;
    code: string;
    description: string | null;
    parent_id: number | null;
    is_active: boolean;
    employee_count?: number;
}
```

#### Validation
- ✅ Department name: required
- ✅ Department code: required
- ✅ Parent department: optional, cannot be self
- ✅ Description: optional
- ✅ Active status: boolean toggle

#### Form Fields
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | string | Yes | Department display name |
| Code | string | Yes | Short code (e.g., HR, IT) |
| Description | textarea | No | Optional description |
| Parent | select | No | Optional parent department |
| Active | checkbox | No | Default: true |

---

### PositionFormModal
**Path:** `resources/js/components/hr/position-form-modal.tsx`

#### Standalone Usage
```tsx
import { PositionFormModal } from '@/components/hr/position-form-modal';
import { useState } from 'react';

export function MyComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const departments = [...];
    const positions = [...];

    const handleSubmit = async (data) => {
        // Call your API or use router.post/put
        await axios.post('/api/positions', data);
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)}>Add Position</button>
            
            <PositionFormModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleSubmit}
                departments={departments}
                positions={positions}
                mode="create"
            />
        </>
    );
}
```

#### Props
```typescript
interface PositionFormModalProps {
    isOpen: boolean;                    // Control modal visibility
    onClose: () => void;                // Called when modal closes
    onSubmit: (data: Omit<Position, 'id' | 'employee_count'>) 
        => Promise<void>;               // Called when form submits
    position?: Position | null;         // Current position (for edit mode)
    departments: Department[];          // All departments (required)
    positions?: Position[];             // All positions (for reports_to dropdown)
    mode?: 'create' | 'edit';          // Form mode
}
```

#### Exported Types
```typescript
export interface Position {
    id: number;
    title: string;
    code: string;
    description: string | null;
    department_id: number;
    reports_to: number | null;
    salary_min: number | null;
    salary_max: number | null;
    is_active: boolean;
    employee_count?: number;
}

export interface Department {
    id: number;
    name: string;
    code: string;
}
```

#### Validation
- ✅ Position title: required
- ✅ Position code: required
- ✅ Department: required
- ✅ Reports to: optional, cannot be self, must be in same department
- ✅ Salary min/max: optional, min cannot be > max
- ✅ Description: optional
- ✅ Active status: boolean toggle

#### Form Fields
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | string | Yes | Position title |
| Code | string | Yes | Position code (e.g., SHM001) |
| Description | textarea | No | Job description |
| Department | select | Yes | Required for filtering reports_to |
| Reports To | select | No | Optional, filtered by department |
| Min Salary | number | No | Decimal, validation against max |
| Max Salary | number | No | Decimal, validation against min |
| Active | checkbox | No | Default: true |

---

## 📊 Data Flow

### Department Management Flow
```
User clicks "New Department"
         ↓
DepartmentIndex opens modal with mode='create'
         ↓
User fills form and submits
         ↓
Modal validates form
         ↓
Modal calls onSubmit callback
         ↓
Page component calls router.post('/hr/departments', data)
         ↓
Inertia redirects to DepartmentIndex (refetch from server)
         ↓
Page re-renders with updated departments list
         ↓
Modal closes automatically
```

### Position Management Flow
```
User clicks "New Position"
         ↓
PositionIndex opens modal with mode='create'
         ↓
User selects department (filters reports_to options)
         ↓
User fills form and submits
         ↓
Modal validates form and salary range
         ↓
Modal calls onSubmit callback
         ↓
Page component calls router.post('/hr/positions', data)
         ↓
Inertia redirects to PositionIndex (refetch from server)
         ↓
Page re-renders with updated positions grouped by department
         ↓
Modal closes automatically
```

---

## 🔌 Integration Checklist

### Backend Requirements
- [ ] DepartmentController with index, store, update, destroy methods
- [ ] PositionController with index, store, update, destroy methods
- [ ] StoreDepartmentRequest with validation rules
- [ ] UpdateDepartmentRequest with validation rules
- [ ] StorePositionRequest with validation rules
- [ ] UpdatePositionRequest with validation rules
- [ ] Routes registered in routes/web.php
- [ ] Policies for department/position authorization
- [ ] Audit logging in controllers
- [ ] Department model with proper relationships
- [ ] Position model with proper relationships

### API Response Format (Expected)
```typescript
// GET /hr/departments
{
    departments: [
        {
            id: 1,
            name: "Human Resources",
            code: "HR",
            description: "HR Department",
            parent_id: null,
            is_active: true,
            employee_count: 5
        }
    ],
    statistics: {
        total: 10,
        active: 8,
        inactive: 2
    }
}

// GET /hr/positions
{
    positions: [
        {
            id: 1,
            title: "HR Manager",
            code: "HRM001",
            description: "Manages HR operations",
            department_id: 1,
            reports_to: 2,
            salary_min: 50000,
            salary_max: 70000,
            is_active: true,
            employee_count: 1
        }
    ],
    departments: [
        {
            id: 1,
            name: "Human Resources",
            code: "HR"
        }
    ],
    statistics: {
        total: 15,
        active: 13,
        inactive: 2
    }
}
```

---

## 🎯 Features Summary

### Department Component
- ✅ Create departments
- ✅ Edit existing departments
- ✅ Add child departments (hierarchical)
- ✅ Archive departments (soft delete)
- ✅ View organization tree structure
- ✅ Department statistics
- ✅ Prevent circular dependencies
- ✅ Active/Inactive status management
- ✅ Full validation and error handling

### Position Component
- ✅ Create positions
- ✅ Edit existing positions
- ✅ Archive positions (soft delete)
- ✅ Define reporting structure
- ✅ Set salary ranges
- ✅ Department association
- ✅ Position filtering by department
- ✅ Active/Inactive status management
- ✅ Position statistics
- ✅ Full validation and error handling

---

## 🧪 Testing Guide

### Manual Testing

#### Department Management
1. Navigate to `/hr/departments`
2. Click "New Department" button
3. Fill form with:
   - Name: "Finance"
   - Code: "FIN"
   - Description: "Finance Department"
   - Parent: (none)
4. Click Create
5. Click on department row dropdown → "Add Child"
6. Create sub-department: "Accounting"
7. Click expand arrow to collapse/expand tree
8. Click on department row dropdown → "Edit"
9. Update description and save
10. Click on department row dropdown → "Archive"
11. Confirm archive

#### Position Management
1. Navigate to `/hr/positions`
2. Click "New Position" button
3. Fill form with:
   - Title: "Finance Manager"
   - Code: "FM001"
   - Department: Select "Finance"
   - Reports To: (none)
   - Min Salary: 45000
   - Max Salary: 65000
4. Click Create
5. Filter by different departments
6. Click on position row dropdown → "Edit"
7. Change "Reports To" to another position
8. Save
9. Click on position row dropdown → "Archive"
10. Confirm archive

#### Validation Testing
- Try submitting form with empty name (should fail)
- Try submitting form with empty code (should fail)
- Try setting salary_min > salary_max (should fail)
- Try setting position as its own parent (should fail)
- Try creating circular department hierarchy (should fail)

---

## 📝 Notes

- All components support dark mode automatically
- Responsive design tested on mobile, tablet, desktop
- Forms validate on client and server side
- All API calls use Inertia.js router for automatic page refresh
- Component state resets when modal closes
- Loading state prevents double submissions
- Error messages display inline in the form
