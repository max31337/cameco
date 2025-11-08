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
        Schema::table('profiles', function (Blueprint $table) {
            // Place of birth
            $table->string('place_of_birth', 200)->nullable()->after('date_of_birth');
            
            // PWD Status
            $table->boolean('is_pwd')->default(false)->after('place_of_birth');
            
            // Spouse information (shown when civil_status is married)
            $table->string('spouse_name', 200)->nullable()->after('is_pwd');
            $table->date('spouse_date_of_birth')->nullable()->after('spouse_name');
            $table->string('spouse_contact_number', 30)->nullable()->after('spouse_date_of_birth');
            
            // Father information
            $table->string('father_name', 200)->nullable()->after('spouse_contact_number');
            $table->date('father_date_of_birth')->nullable()->after('father_name');
            
            // Mother information
            $table->string('mother_name', 200)->nullable()->after('father_date_of_birth');
            $table->date('mother_date_of_birth')->nullable()->after('mother_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'place_of_birth',
                'is_pwd',
                'spouse_name',
                'spouse_date_of_birth',
                'spouse_contact_number',
                'father_name',
                'father_date_of_birth',
                'mother_name',
                'mother_date_of_birth',
            ]);
        });
    }
};
