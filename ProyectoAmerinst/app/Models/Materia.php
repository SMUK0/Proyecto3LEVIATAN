<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    protected $table = 'materias';
    protected $primaryKey = 'materia_id';

    // Campos asignables en masa
    protected $fillable = ['nombre'];

    public $timestamps = false; // Esta tabla no tiene timestamps

    // Relación con cursos y maestros
    public function cursos()
    {
        return $this->belongsToMany(Curso::class, 'maestro_curso', 'materia_id', 'curso_id')
                    ->withPivot('maestro_id');
    }
}
