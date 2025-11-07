<?php

namespace App\Http\Requests\System\Security;

use Illuminate\Foundation\Http\FormRequest;

class UserLifecycleRequest extends FormRequest
{
	public function authorize(): bool
	{
		return $this->user()->hasRole('Superadmin');
	}

	public function rules(): array
	{
		$userId = $this->route('user')?->id;

		return [
			'name' => ['sometimes', 'string', 'max:255'],
			'email' => [
				'sometimes',
				'email',
				'max:255',
				'unique:users,email,' . ($userId ? $userId : 'NULL') . ',id',
			],
			'roles' => ['sometimes', 'array'],
			'roles.*' => ['integer', 'exists:roles,id'],
			'is_active' => ['sometimes', 'boolean'],
			'new_password' => ['nullable', 'string', 'min:8', 'confirmed'],
			'reason_for_deactivation' => ['required_if:is_active,false', 'string', 'max:500'],
		];
	}

	public function messages(): array
	{
		return [
			'new_password.min' => 'Password must be at least 8 characters.',
			'reason_for_deactivation.required_if' => 'Please provide a reason for deactivating this user.',
		];
	}
}
