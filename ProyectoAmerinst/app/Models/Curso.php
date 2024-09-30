<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    use HasFactory;
    // Nombre de la tabla
    protected $table = 'cursos';

    // Clave primaria
    protected $primaryKey = 'curso_id';

    // Desactivar timestamps si no usas created_at/updated_at
    public $timestamps = false;

    // Campos asignables masivamente
    protected $fillable = ['nombre', 'grado'];
}
