<?php

namespace App\Providers;

use App\Repositories\Contracts\System\CronRepositoryInterface;
use App\Repositories\Contracts\System\SystemHealthRepositoryInterface;
use App\Repositories\Contracts\System\SuperadminSLARepositoryInterface;
use App\Repositories\Eloquent\System\CronRepository;
use App\Repositories\Eloquent\System\SystemHealthRepository;
use App\Repositories\Eloquent\System\SuperadminSLARepository;
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

        // Bind Superadmin SLA Repository
        $this->app->bind(
            SuperadminSLARepositoryInterface::class,
            SuperadminSLARepository::class
        );

        // Bind Cron Repository
        $this->app->bind(
            CronRepositoryInterface::class,
            CronRepository::class
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

