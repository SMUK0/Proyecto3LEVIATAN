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
    protected $fillable = [
        'estudiante_id',
        'curso_id',
        'estado',
        'fecha',
        'observaciones',
    ];

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

    // Método para validar los datos de asistencia
    public static function validate($data)
    {
        return validator($data, [
            'estudiante_id' => 'required|integer|exists:estudiantes,estudiante_id',
            'curso_id' => 'required|integer|exists:cursos,curso_id',
            'estado' => 'required|string|in:P,A,T',
            'fecha' => 'required|date',
            'observaciones' => 'nullable|string',
        ]);
    }
}

