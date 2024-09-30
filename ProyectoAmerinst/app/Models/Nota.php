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
        'fecha',
        'observaciones',
    ];

    public $timestamps = false; // Si no tienes columnas created_at y updated_at
}
