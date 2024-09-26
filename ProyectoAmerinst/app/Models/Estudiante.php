<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    protected $fillable = [
        'nombre', 'apellido', 'fecha_nacimiento', 'grado',
    ];

    public function padres()
    {
        return $this->belongsToMany(Usuario::class, 'estudiante_padre', 'estudiante_id', 'padre_id');
    }

    public function notas()
    {
        return $this->hasMany(Nota::class);
    }
}
