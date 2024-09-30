<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $table = 'asistencias';
    protected $primaryKey = 'asistencia_id';

    protected $fillable = [
        'estudiante_id',
        'curso_id',
        'fecha',
        'estado',
        'observaciones'
    ];

    public $timestamps = false; // Si no tienes columnas created_at y updated_at
}
