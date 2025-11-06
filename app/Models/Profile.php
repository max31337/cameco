<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'profiles';
    protected $fillable = ['user_id','first_name','last_name','middle_name','contact_number','address','emergency_contact'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
