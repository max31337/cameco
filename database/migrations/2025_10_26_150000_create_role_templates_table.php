<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('role_templates')) {
            Schema::create('role_templates', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('name', 100)->unique();
                $table->string('description', 255)->nullable();
                $table->json('template_json');
                $table->unsignedBigInteger('created_by');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('role_templates')) {
            Schema::dropIfExists('role_templates');
        }
    }
};
