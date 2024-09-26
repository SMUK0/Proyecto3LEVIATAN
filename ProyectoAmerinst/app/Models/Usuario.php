<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Authenticatable
{
    /* use HasFactory; */
    protected $fillable = [
        'nombre', 'apellido', 'email', 'password_hash', 'rol_id',
    ];

    public function rol()
    {
        return $this->belongsTo(Role::class);
    }

    public function estudiantes()
    {
        return $this->hasManyThrough(Estudiante::class, EstudiantePadre::class, 'padre_id', 'estudiante_id');
    }
}
