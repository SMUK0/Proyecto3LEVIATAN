<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaestroCurso extends Model
{
    use HasFactory;

    protected $table = 'maestro_curso';

    // Campos asignables en masa
    protected $fillable = ['maestro_id', 'curso_id'];

    public $timestamps = false;

    // Eliminamos la definición de primaryKey compuesta
    public $incrementing = false;

    // Establecemos la clave primaria como un string (requerido cuando incrementing está en false)
    protected $keyType = 'string';
}
