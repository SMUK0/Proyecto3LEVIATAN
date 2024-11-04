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

    public $timestamps = false; // Esta tabla no tiene timestamps

    // Especificar que la clave primaria no es autoincremental
    public $incrementing = false;

    // Definir la clave primaria compuesta
    protected $primaryKey = ['maestro_id', 'curso_id'];
}
