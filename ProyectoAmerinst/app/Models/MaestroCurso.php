<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class MaestroCurso extends Pivot
{
    use HasFactory;

    protected $table = 'maestro_curso';

    // Campos asignables en masa
    protected $fillable = ['maestro_id', 'curso_id'];

    public $timestamps = false; // Esta tabla no tiene timestamps
}
