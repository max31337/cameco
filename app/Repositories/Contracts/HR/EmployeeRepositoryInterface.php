<?php

namespace App\Repositories\Contracts\HR;

interface EmployeeRepositoryInterface
{
    /**
     * Get all employees with optional filters and pagination.
     *
     * @param array $filters Filter options (status, department_id, employment_type, search, etc.)
     * @param int $perPage Number of results per page
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function all(array $filters = [], int $perPage = 15);

    /**
     * Find an employee by ID.
     *
     * @param int $id
     * @return \App\Models\Employee|null
     */
    public function find(int $id);

    /**
     * Find an employee by employee number.
     *
     * @param string $employeeNumber
     * @return \App\Models\Employee|null
     */
    public function findByEmployeeNumber(string $employeeNumber);

    /**
     * Create a new employee record.
     *
     * @param array $data
     * @return \App\Models\Employee
     */
    public function create(array $data);

    /**
     * Update an existing employee record.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Employee
     */
    public function update(int $id, array $data);

    /**
     * Soft delete an employee (archive).
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id);

    /**
     * Restore a soft-deleted employee.
     *
     * @param int $id
     * @return bool
     */
    public function restore(int $id);

    /**
     * Get employees by department.
     *
     * @param int $departmentId
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getByDepartment(int $departmentId, int $perPage = 15);

    /**
     * Get employees by status.
     *
     * @param string $status
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getByStatus(string $status, int $perPage = 15);

    /**
     * Search employees by name, employee number, or department.
     *
     * @param string $query
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function search(string $query, int $perPage = 15);

    /**
     * Get employee statistics for dashboard.
     *
     * @return array
     */
    public function getStatistics(): array;

    /**
     * Get employees with their profiles and departments.
     *
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllWithRelations(array $filters = [], int $perPage = 15);

    /**
     * Get recent hires (last 30 days).
     *
     * @param int $days
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRecentHires(int $days = 30, int $limit = 10);

    /**
     * Get employees by supervisor.
     *
     * @param int $supervisorId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getBySupervisor(int $supervisorId);
}
