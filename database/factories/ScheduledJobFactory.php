<?php

namespace Database\Factories;

use App\Models\ScheduledJob;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduledJobFactory extends Factory
{
    protected $model = ScheduledJob::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->sentence(),
            'command' => $this->faker->randomElement([
                'cache:clear',
                'backup:run',
                'queue:work',
                'schedule:run',
                'migrate',
                'db:seed',
            ]),
            'cron_expression' => $this->faker->randomElement([
                '* * * * *',
                '0 * * * *',
                '0 0 * * *',
                '0 0 * * 0',
                '0 0 1 * *',
            ]),
            'is_enabled' => $this->faker->boolean(80),
            'last_run_at' => $this->faker->dateTimeThisMonth(),
            'next_run_at' => $this->faker->dateTimeBetween('+1 day', '+7 days'),
            'last_exit_code' => $this->faker->randomElement([0, 0, 0, 1, null]),
            'last_output' => $this->faker->sentence(),
            'run_count' => $this->faker->numberBetween(0, 100),
            'success_count' => $this->faker->numberBetween(0, 95),
            'failure_count' => $this->faker->numberBetween(0, 5),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    public function enabled(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => true,
        ]);
    }

    public function disabled(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => false,
        ]);
    }

    public function successful(): self
    {
        return $this->state(fn (array $attributes) => [
            'last_exit_code' => 0,
            'success_count' => 95,
            'failure_count' => 5,
            'run_count' => 100,
        ]);
    }

    public function failed(): self
    {
        return $this->state(fn (array $attributes) => [
            'last_exit_code' => 1,
            'success_count' => 50,
            'failure_count' => 50,
            'run_count' => 100,
        ]);
    }

    public function daily(): self
    {
        return $this->state(fn (array $attributes) => [
            'cron_expression' => '0 0 * * *',
        ]);
    }

    public function hourly(): self
    {
        return $this->state(fn (array $attributes) => [
            'cron_expression' => '0 * * * *',
        ]);
    }

    public function everyMinute(): self
    {
        return $this->state(fn (array $attributes) => [
            'cron_expression' => '* * * * *',
        ]);
    }
}
