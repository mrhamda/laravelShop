<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'image',
        'user_id',
        'quantity'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
