<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\System\Organization\SystemOnboardingRepositoryInterface;
use App\Repositories\Eloquent\System\Organization\SystemOnboardingRepository;

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
