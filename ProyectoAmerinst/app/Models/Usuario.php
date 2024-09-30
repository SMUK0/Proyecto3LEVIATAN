<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;
    protected $table = 'usuarios';
    
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'nombre', 'apellido', 'email', 'password_hash', 'rol_id'
    ];

    public $timestamps = false;  // Si no usas timestamps de Laravel (created_at, updated_at)
}
