<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class collectMoneyModel extends Model
{
    protected $table = 'collect_money_models';
    protected $fillable = [
        'user_id',
        'money',
    ];
}
