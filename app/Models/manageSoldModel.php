<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class manageSoldModel extends Model
{
    protected $table = 'manage_sold_models';


    protected $fillable = [
        'title',
        'quantity',
        'total',
        'to_user_id',
        'from_user_id',
    ];
}
