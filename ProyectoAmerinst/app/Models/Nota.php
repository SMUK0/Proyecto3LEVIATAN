<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $fillable = ['estudiante_id', 'curso_id', 'materia_id', 'maestro_id', 'nota', 'fecha', 'observaciones'];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class);
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class);
    }

    public function maestro()
    {
        return $this->belongsTo(related: Usuario::class, foreignKey: 'maestro_id');
    }
}
