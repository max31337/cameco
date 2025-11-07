<?php

namespace App\Http\Requests\System\Security;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
	public function authorize(): bool
	{
		return $this->user()->hasRole('Superadmin');
	}

	public function rules(): array
	{
		$roleId = $this->route('role')?->id;

		return [
			'name' => [
				'required',
				'string',
				'max:255',
				'regex:/^[a-z_]+$/', // Lowercase with underscores only
				'unique:roles,name,' . ($roleId ? $roleId : 'NULL') . ',id',
				'not_in:superadmin,admin,user', // Prevent system role names
			],
			'description' => ['nullable', 'string', 'max:500'],
			'permissions' => ['nullable', 'array'],
			'permissions.*' => ['integer', 'exists:permissions,id'],
		];
	}

	public function messages(): array
	{
		return [
			'name.regex' => 'Role name must contain only lowercase letters and underscores.',
			'name.not_in' => 'Cannot use system role names.',
			'permissions.*.exists' => 'One or more selected permissions do not exist.',
		];
	}
}
