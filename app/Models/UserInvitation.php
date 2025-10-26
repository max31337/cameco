<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInvitation extends Model
{
    protected $table = 'user_invitations';
    protected $fillable = ['email','token','role','department_id','invited_by','expires_at','status'];
    public $timestamps = true;
}
