<?php

namespace App\Services\System\Exceptions;

use Exception;

class InvalidRoleTransitionException extends Exception
{
    public function __construct(string $current, string $next)
    {
        parent::__construct("Invalid role transition: {$current} → {$next}");
    }
}
