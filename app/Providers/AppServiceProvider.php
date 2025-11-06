<?php

namespace App\Providers;

use App\Repositories\Contracts\SLAMonitoringRepositoryInterface;
use App\Repositories\Eloquent\System\SLAMonitoringRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind SLA Monitoring Repository
        $this->app->bind(
            SLAMonitoringRepositoryInterface::class,
            SLAMonitoringRepository::class
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
