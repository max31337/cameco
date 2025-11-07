<?php

namespace App\Rules;

use Closure;
use Cron\CronExpression;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCronExpression implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('The :attribute must be a valid cron expression string.');
            return;
        }

        try {
            // Validate using the CronExpression library
            if (!CronExpression::isValidExpression($value)) {
                $fail('The :attribute is not a valid cron expression.');
                return;
            }

            // Additional validation: ensure expression can be parsed
            $cron = new CronExpression($value);
            
            // Try to get next run date to ensure it's parseable
            $cron->getNextRunDate();
            
        } catch (\Exception $e) {
            $fail('The :attribute is not a valid cron expression: ' . $e->getMessage());
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'The :attribute must be a valid cron expression (e.g., "0 0 * * *" for daily at midnight).';
    }
}
