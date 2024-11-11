<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    use HasFactory;

    protected $table = 'cursos';
    protected $primaryKey = 'curso_id';

    // Campos asignables en masa
    protected $fillable = ['nombre', 'grado'];

    public $timestamps = false; // Esta tabla no tiene timestamps

    // Relación con estudiantes
    public function estudiantes()
    {
        return $this->hasMany(Estudiante::class, 'curso_id', 'curso_id');
    }

    // Relación con materias (a través de maestros)
    public function materias()
    {
        return $this->belongsToMany(Materia::class, 'maestro_curso', 'curso_id', 'materia_id')
                    ->withPivot('maestro_id');
    }

    public function maestros()
    {
        return $this->belongsToMany(Usuario::class, 'maestro_curso', 'curso_id', 'user_id');
    }
    
}
