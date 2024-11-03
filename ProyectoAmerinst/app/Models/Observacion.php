<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observacion extends Model
{
    use HasFactory;

    protected $table = 'observaciones';
    protected $primaryKey = 'observacion_id';

    // Campos asignables en masa
    protected $fillable = ['estudiante_id', 'curso_id', 'maestro_id', 'descripcion'];

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

    // Relación con maestros (usuarios)
    public function maestro()
    {
        return $this->belongsTo(Usuario::class, 'maestro_id', 'user_id');
    }
}
