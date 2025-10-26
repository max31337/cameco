<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration will copy rows from a legacy `role_user` pivot (if present)
     * into Spatie's `model_has_roles` table. It is intentionally non-destructive
     * (does not drop the legacy table) so it's safe to run in CI and dev.
     */
    public function up(): void
    {
        $roleUserTable = 'role_user';
        $rolesTable = config('permission.table_names.roles', 'roles');
        $modelHasRoles = config('permission.table_names.model_has_roles', 'model_has_roles');

        if (! Schema::hasTable($roleUserTable) || ! Schema::hasTable($rolesTable) || ! Schema::hasTable($modelHasRoles)) {
            // Nothing to migrate or Spatie tables not present yet.
            return;
        }

        $rows = DB::table($roleUserTable)->get();
        foreach ($rows as $r) {
            // Expecting columns: user_id, role_id (legacy convention). Be defensive.
            $userId = $r->user_id ?? ($r->userId ?? null);
            $roleId = $r->role_id ?? ($r->roleId ?? null);

            if (! $userId || ! $roleId) {
                continue;
            }

            // Avoid duplicate inserts
            $exists = DB::table($modelHasRoles)
                ->where('role_id', $roleId)
                ->where('model_type', \App\Models\User::class)
                ->where('model_id', $userId)
                ->exists();

            if (! $exists) {
                DB::table($modelHasRoles)->insert([
                    'role_id' => $roleId,
                    'model_type' => \App\Models\User::class,
                    'model_id' => $userId,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * This will remove inserted rows from `model_has_roles` where model_type is App\Models\User
     * and role_id and model_id match rows existing in the legacy pivot table at the time of running `down()`.
     */
    public function down(): void
    {
        $roleUserTable = 'role_user';
        $modelHasRoles = config('permission.table_names.model_has_roles', 'model_has_roles');

        if (! Schema::hasTable($roleUserTable) || ! Schema::hasTable($modelHasRoles)) {
            return;
        }

        $rows = DB::table($roleUserTable)->get();
        foreach ($rows as $r) {
            $userId = $r->user_id ?? ($r->userId ?? null);
            $roleId = $r->role_id ?? ($r->roleId ?? null);

            if (! $userId || ! $roleId) {
                continue;
            }

            DB::table($modelHasRoles)
                ->where('role_id', $roleId)
                ->where('model_type', \App\Models\User::class)
                ->where('model_id', $userId)
                ->delete();
        }
    }
};
