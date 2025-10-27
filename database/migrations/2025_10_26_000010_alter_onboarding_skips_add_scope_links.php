<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('onboarding_skips', function (Blueprint $table) {
            if (! Schema::hasColumn('onboarding_skips', 'scope')) {
                $table->enum('scope', ['system','user'])->default('user')->after('reason');
            }

            if (! Schema::hasColumn('onboarding_skips', 'system_onboarding_id')) {
                $table->unsignedBigInteger('system_onboarding_id')->nullable()->after('scope');
            }

            if (! Schema::hasColumn('onboarding_skips', 'user_onboarding_id')) {
                $table->unsignedBigInteger('user_onboarding_id')->nullable()->after('system_onboarding_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('onboarding_skips', function (Blueprint $table) {
            if (Schema::hasColumn('onboarding_skips', 'user_onboarding_id')) {
                $table->dropColumn('user_onboarding_id');
            }

            if (Schema::hasColumn('onboarding_skips', 'system_onboarding_id')) {
                $table->dropColumn('system_onboarding_id');
            }

            if (Schema::hasColumn('onboarding_skips', 'scope')) {
                $table->dropColumn('scope');
            }
        });
    }
};
