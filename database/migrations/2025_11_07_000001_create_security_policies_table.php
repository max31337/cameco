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
        Schema::create('security_policies', function (Blueprint $table) {
            $table->id();
            $table->string('policy_key')->unique(); // e.g., 'password_length', 'session_timeout'
            $table->string('policy_value'); // The actual setting value
            $table->string('policy_type'); // 'string', 'integer', 'boolean'
            $table->text('description')->nullable();
            $table->string('category'); // 'password', '2fa', 'session', 'login'
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_policies');
    }
};
