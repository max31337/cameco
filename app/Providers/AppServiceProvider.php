<?php

namespace App\Providers;

use App\Repositories\Contracts\System\SystemHealthRepositoryInterface;
use App\Repositories\Contracts\System\Vendor\RemoteVendorSLARepositoryInterface;
use App\Repositories\Eloquent\System\SystemHealthRepository;
use App\Repositories\Eloquent\System\Vendor\RemoteVendorSLARepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind System Health Repository
        $this->app->bind(
            SystemHealthRepositoryInterface::class,
            SystemHealthRepository::class
        );

        // Bind Remote Vendor SLA Repository
        $this->app->bind(
            RemoteVendorSLARepositoryInterface::class,
            RemoteVendorSLARepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

