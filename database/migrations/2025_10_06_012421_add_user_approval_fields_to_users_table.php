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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['pending', 'active', 'suspended', 'rejected'])
                ->default('pending')
                ->after('email_verified_at');
            
            $table->foreignId('approved_by')
                ->nullable()
                ->after('status')
                ->constrained('users')
                ->nullOnDelete();
            
            $table->timestamp('approved_at')
                ->nullable()
                ->after('approved_by');
            
            $table->text('rejection_reason')
                ->nullable()
                ->after('approved_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['status', 'approved_by', 'approved_at', 'rejection_reason']);
        });
    }
};
