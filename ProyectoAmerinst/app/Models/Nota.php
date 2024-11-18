<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    use HasFactory;

    protected $table = 'notas';
    protected $primaryKey = 'nota_id';

    protected $fillable = [
        'estudiante_id',
        'curso_id',
        'materia_id',
        'maestro_id',
        'nota',
        'tipo',
        'bimestre',
        'fecha',
        'observaciones',
    ];

    public const TIPOS = ['tarea', 'examen'];
    public const BIMESTRES = [1, 2, 3, 4];

    public $timestamps = false;

    // Relación con el modelo Estudiante
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'estudiante_id', 'estudiante_id');
    }

    // Relación con el modelo Curso
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id', 'curso_id');
    }

    // Relación con el modelo Materia
    public function materia()
    {
        return $this->belongsTo(Materia::class, 'materia_id', 'materia_id');
    }

    // Relación con el modelo Usuario (Maestro)
    public function maestro()
    {
        return $this->belongsTo(Usuario::class, 'maestro_id', 'user_id');
    }

    // Método para validar tipo y bimestre
    public static function validate($data)
    {
        return validator($data, [
            'estudiante_id' => 'required|integer|exists:estudiantes,estudiante_id',
            'curso_id' => 'required|integer|exists:cursos,curso_id',
            'materia_id' => 'required|integer|exists:materias,materia_id',
            'maestro_id' => 'required|integer|exists:usuarios,user_id',
            'nota' => 'required|numeric|min:0|max:10',
            'tipo' => 'required|string|in:' . implode(',', self::TIPOS),
            'bimestre' => 'required|integer|in:' . implode(',', self::BIMESTRES),
            'fecha' => 'required|date',
            'observaciones' => 'nullable|string',
        ]);
    }
}
