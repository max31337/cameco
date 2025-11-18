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
            // Make user_id nullable for employee profiles
            $table->unsignedBigInteger('user_id')->nullable()->change();
            
            // Rename dob to date_of_birth
            $table->renameColumn('dob', 'date_of_birth');
            
            // Add suffix field
            $table->string('suffix', 10)->nullable()->after('last_name');
            
            // Add gender and civil status
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('middle_name');
            $table->enum('civil_status', ['single', 'married', 'divorced', 'widowed', 'separated'])->nullable()->after('gender');
            
            // Update contact fields
            $table->string('phone', 30)->nullable()->after('civil_status');
            $table->string('mobile', 30)->nullable()->after('phone');
            $table->dropColumn('contact_number');
            
            // Update address fields
            $table->text('current_address')->nullable()->after('mobile');
            $table->text('permanent_address')->nullable()->after('current_address');
            $table->dropColumn('address');
            
            // Add emergency contact fields
            $table->string('emergency_contact_name', 100)->nullable()->after('permanent_address');
            $table->string('emergency_contact_relationship', 50)->nullable()->after('emergency_contact_name');
            $table->string('emergency_contact_phone', 30)->nullable()->after('emergency_contact_relationship');
            $table->text('emergency_contact_address')->nullable()->after('emergency_contact_phone');
            $table->dropColumn('emergency_contact');
            
            // Add government ID fields
            $table->string('sss_number', 20)->nullable()->after('emergency_contact_address');
            $table->string('tin_number', 20)->nullable()->after('sss_number');
            $table->string('philhealth_number', 20)->nullable()->after('tin_number');
            $table->string('pagibig_number', 20)->nullable()->after('philhealth_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Reverse all changes
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->renameColumn('date_of_birth', 'dob');
            $table->dropColumn([
                'suffix',
                'gender',
                'civil_status',
                'phone',
                'mobile',
                'current_address',
                'permanent_address',
                'emergency_contact_name',
                'emergency_contact_relationship',
                'emergency_contact_phone',
                'emergency_contact_address',
                'sss_number',
                'tin_number',
                'philhealth_number',
                'pagibig_number',
            ]);
            $table->string('contact_number', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact', 100)->nullable();
        });
    }
};
