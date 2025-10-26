<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('system_onboarding', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->enum('status', ['pending','in_progress','completed','skipped'])->default('pending');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('skipped_at')->nullable();
            $table->unsignedBigInteger('skipped_by')->nullable();
            $table->json('checklist_json')->nullable();
            $table->timestamps();

            $table->foreign('skipped_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_onboarding');
    }
};
