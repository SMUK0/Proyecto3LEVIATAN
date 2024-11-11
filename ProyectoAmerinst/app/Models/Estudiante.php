<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    use HasFactory;

    protected $table = 'estudiantes';
    protected $primaryKey = 'estudiante_id';

    // Campos asignables en masa
    protected $fillable = ['nombre', 'apellido', 'fecha_nacimiento', 'curso_id'];

    public $timestamps = true;

    // Relación con cursos
    public function curso()
{
    return $this->belongsTo(Curso::class, 'curso_id', 'curso_id');
}


    // Relación con asistencias
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'estudiante_id', 'estudiante_id');
    }

    // Relación con observaciones
    public function observaciones()
    {
        return $this->hasMany(Observacion::class, 'estudiante_id', 'estudiante_id');
    }

    // Relación con notificaciones
    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'estudiante_id', 'estudiante_id');
    }
}
