<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Backfill profiles for existing users where no profile exists yet.
        DB::table('users')->orderBy('id')->chunk(200, function ($users) {
            foreach ($users as $u) {
                $exists = DB::table('profiles')->where('user_id', $u->id)->exists();
                if ($exists) {
                    continue;
                }

                $name = trim((string) ($u->name ?? ''));
                if ($name === '') {
                    // create an empty profile so future code can rely on profile existence
                    DB::table('profiles')->insert([
                        'user_id' => $u->id,
                        'first_name' => '',
                        'last_name' => '',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    continue;
                }

                $parts = preg_split('/\s+/', $name);
                $first = $parts[0] ?? '';
                $last = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : '';

                DB::table('profiles')->insert([
                    'user_id' => $u->id,
                    'first_name' => $first,
                    'last_name' => $last,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });
    }

    public function down(): void
    {
        // This migration is not easily reversible. We leave existing profiles intact.
    }
};
