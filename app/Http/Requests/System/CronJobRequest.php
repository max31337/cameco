<?php

namespace App\Http\Requests\System;

use App\Rules\ValidCronExpression;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CronJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization is handled by middleware (superadmin)
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $jobId = $this->route('id');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('scheduled_jobs', 'name')->ignore($jobId)->whereNull('deleted_at'),
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'command' => [
                'required',
                'string',
                'max:255',
            ],
            'cron_expression' => [
                'required',
                'string',
                new ValidCronExpression(),
            ],
            'is_enabled' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The job name is required.',
            'name.unique' => 'A job with this name already exists.',
            'name.max' => 'The job name must not exceed 255 characters.',
            'description.max' => 'The description must not exceed 1000 characters.',
            'command.required' => 'The command is required.',
            'command.max' => 'The command must not exceed 255 characters.',
            'cron_expression.required' => 'The cron expression is required.',
            'is_enabled.boolean' => 'The enabled status must be true or false.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'job name',
            'description' => 'job description',
            'command' => 'command',
            'cron_expression' => 'cron expression',
            'is_enabled' => 'enabled status',
        ];
    }
}
