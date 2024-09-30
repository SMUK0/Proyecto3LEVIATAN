<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    use HasFactory;

    // Tabla asociada al modelo
    protected $table = 'estudiantes';

    // Clave primaria
    protected $primaryKey = 'estudiante_id';

    // Desactivar timestamps automáticos
    public $timestamps = false;

    // Campos que son asignables masivamente
    protected $fillable = ['nombre', 'apellido', 'fecha_nacimiento', 'grado'];
}
