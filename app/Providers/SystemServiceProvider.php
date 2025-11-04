<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\SystemOnboardingRepositoryInterface;
use App\Repositories\SystemOnboardingRepository;

class SystemServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            SystemOnboardingRepositoryInterface::class,
            SystemOnboardingRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
