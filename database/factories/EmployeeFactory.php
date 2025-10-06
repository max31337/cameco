<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $firstName = $this->faker->firstName($gender);
        $lastName = $this->faker->lastName();
        
        return [
            'lastname' => $lastName,
            'firstname' => $firstName,
            'middlename' => $this->faker->optional(0.7)->lastName(),
            
            // Personal Information
            'address' => $this->faker->address(),
            'contact_number' => $this->faker->phoneNumber(),
            'email_personal' => $this->faker->optional(0.8)->email(),
            'place_of_birth' => $this->faker->city(),
            'date_of_birth' => $this->faker->date('Y-m-d', '2000-01-01'),
            'civil_status' => $this->faker->randomElement(['single', 'married', 'divorced', 'widowed']),
            'gender' => $gender,
            
            // Employment Information
            'department_id' => \App\Models\Department::factory(),
            'position' => $this->faker->jobTitle(),
            'employment_type' => $this->faker->randomElement(['regular', 'contractual', 'probationary', 'consultant']),
            'date_employed' => $this->faker->date('Y-m-d', '2020-01-01'),
            'date_regularized' => $this->faker->optional(0.6)->date('Y-m-d', '2021-01-01'),
            
            // Government IDs (optional)
            'sss_no' => $this->faker->optional(0.7)->numerify('##-#######-#'),
            'pagibig_no' => $this->faker->optional(0.7)->numerify('############'),
            'tin_no' => $this->faker->optional(0.7)->numerify('###-###-###-###'),
            'philhealth_no' => $this->faker->optional(0.7)->numerify('##-#########-#'),
            
            // Family Information (optional)
            'spouse_name' => $this->faker->optional(0.4)->name(),
            'spouse_dob' => $this->faker->optional(0.4)->date('Y-m-d', '2000-01-01'),
            'spouse_occupation' => $this->faker->optional(0.4)->jobTitle(),
            'father_name' => $this->faker->optional(0.8)->name('male'),
            'father_dob' => $this->faker->optional(0.8)->date('Y-m-d', '1970-01-01'),
            'mother_name' => $this->faker->optional(0.8)->name('female'),
            'mother_dob' => $this->faker->optional(0.8)->date('Y-m-d', '1970-01-01'),
            
            // Emergency Contact
            'emergency_contact_name' => $this->faker->name(),
            'emergency_contact_relationship' => $this->faker->randomElement(['spouse', 'parent', 'sibling', 'friend', 'relative']),
            'emergency_contact_number' => $this->faker->phoneNumber(),
            
            // System Fields
            'status' => 'active',
            'created_by' => 1, // Admin user
        ];
    }
}
