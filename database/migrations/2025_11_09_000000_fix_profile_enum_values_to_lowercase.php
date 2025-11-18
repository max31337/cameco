<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite doesn't support changing enum types directly, so we need to update the values
        // For MySQL/PostgreSQL, we can use rawStatements
        $driver = DB::getDriverName();
        
        if ($driver === 'mysql') {
            Schema::table('profiles', function (Blueprint $table) {
                $table->enum('gender', ['male', 'female', 'other'])->nullable()->change();
                $table->enum('civil_status', ['single', 'married', 'divorced', 'widowed', 'separated'])->nullable()->change();
            });
        } elseif ($driver === 'pgsql') {
            // PostgreSQL
            // Check if gender type exists before attempting to rename
            $genderExists = DB::selectOne("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender')");
            if ($genderExists && $genderExists->exists) {
                DB::statement("ALTER TYPE gender RENAME TO gender_old");
                DB::statement("CREATE TYPE gender AS ENUM ('male', 'female', 'other')");
                DB::statement("ALTER TABLE profiles ALTER COLUMN gender TYPE gender USING gender::text::gender");
                DB::statement("DROP TYPE gender_old");
            }
            
            // Check if civil_status type exists before attempting to rename
            $civilStatusExists = DB::selectOne("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'civil_status')");
            if ($civilStatusExists && $civilStatusExists->exists) {
                DB::statement("ALTER TYPE civil_status RENAME TO civil_status_old");
                DB::statement("CREATE TYPE civil_status AS ENUM ('single', 'married', 'divorced', 'widowed', 'separated')");
                DB::statement("ALTER TABLE profiles ALTER COLUMN civil_status TYPE civil_status USING civil_status::text::civil_status");
                DB::statement("DROP TYPE civil_status_old");
            }
        } else {
            // SQLite - need to recreate the table
            // This is a simple update for SQLite since it doesn't enforce enum constraints
            DB::statement("UPDATE profiles SET gender = LOWER(gender) WHERE gender IS NOT NULL");
            DB::statement("UPDATE profiles SET civil_status = LOWER(civil_status) WHERE civil_status IS NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'mysql') {
            Schema::table('profiles', function (Blueprint $table) {
                $table->enum('gender', ['Male', 'Female', 'Other'])->nullable()->change();
                $table->enum('civil_status', ['Single', 'Married', 'Divorced', 'Widowed'])->nullable()->change();
            });
        } elseif ($driver === 'pgsql') {
            // PostgreSQL
            // Check if gender type exists before attempting to rename
            $genderExists = DB::selectOne("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender')");
            if ($genderExists && $genderExists->exists) {
                DB::statement("ALTER TYPE gender RENAME TO gender_old");
                DB::statement("CREATE TYPE gender AS ENUM ('Male', 'Female', 'Other')");
                DB::statement("ALTER TABLE profiles ALTER COLUMN gender TYPE gender USING gender::text::gender");
                DB::statement("DROP TYPE gender_old");
            }
            
            // Check if civil_status type exists before attempting to rename
            $civilStatusExists = DB::selectOne("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'civil_status')");
            if ($civilStatusExists && $civilStatusExists->exists) {
                DB::statement("ALTER TYPE civil_status RENAME TO civil_status_old");
                DB::statement("CREATE TYPE civil_status AS ENUM ('Single', 'Married', 'Divorced', 'Widowed')");
                DB::statement("ALTER TABLE profiles ALTER COLUMN civil_status TYPE civil_status USING civil_status::text::civil_status");
                DB::statement("DROP TYPE civil_status_old");
            }
        } else {
            // SQLite
            DB::statement("UPDATE profiles SET gender = UPPER(SUBSTR(gender, 1, 1)) || LOWER(SUBSTR(gender, 2)) WHERE gender IS NOT NULL");
            DB::statement("UPDATE profiles SET civil_status = UPPER(SUBSTR(civil_status, 1, 1)) || LOWER(SUBSTR(civil_status, 2)) WHERE civil_status IS NOT NULL");
        }
    }
};
