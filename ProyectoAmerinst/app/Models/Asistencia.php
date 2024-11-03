<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $table = 'asistencias';
    protected $primaryKey = 'asistencia_id';

    // Campos asignables en masa
    protected $fillable = ['estudiante_id', 'curso_id', 'estado', 'observaciones'];

    public $timestamps = true;

    // Relación con estudiantes
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'estudiante_id', 'estudiante_id');
    }

    // Relación con cursos
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id', 'curso_id');
    }
}
