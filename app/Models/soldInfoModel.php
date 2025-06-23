<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class soldInfoModel extends Model
{
    protected $table = 'sold_info_models';


    protected $fillable = [
        'title',
        'quantity',
        'total',
        'to_user_id',
        'from_user_id',
    ];
}
