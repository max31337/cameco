<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Vendor Support Contract Configuration
    |--------------------------------------------------------------------------
    |
    | These settings define the support contract terms for this deployment.
    | Update these values when renewing support contracts.
    |
    */

    'contract' => [
        'number' => env('SUPPORT_CONTRACT_NUMBER', 'CAMECO-2025-001'),
        'start_date' => env('SUPPORT_START_DATE', '2025-11-08'),
        'end_date' => env('SUPPORT_END_DATE', '2027-11-08'),
        'level' => env('SUPPORT_LEVEL', 'premium'), // basic, standard, premium
        'contact_email' => env('SUPPORT_CONTACT_EMAIL', 'support@example.com'),
        'contact_phone' => env('SUPPORT_CONTACT_PHONE', '+1-555-0100'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Support Levels
    |--------------------------------------------------------------------------
    |
    | Define the response times and availability for each support level.
    |
    */

    'levels' => [
        'basic' => [
            'name' => 'Basic Support',
            'response_time' => '48 hours',
            'availability' => 'Business hours (9 AM - 5 PM)',
            'channels' => ['email'],
        ],
        'standard' => [
            'name' => 'Standard Support',
            'response_time' => '24 hours',
            'availability' => 'Extended hours (8 AM - 8 PM)',
            'channels' => ['email', 'phone'],
        ],
        'premium' => [
            'name' => 'Premium Support',
            'response_time' => '4 hours',
            'availability' => '24/7',
            'channels' => ['email', 'phone', 'priority'],
        ],
    ],

];
