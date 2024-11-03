<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class EstudiantePadre extends Pivot
{
    use HasFactory;

    protected $table = 'estudiante_padre';

    // Campos asignables en masa
    protected $fillable = ['estudiante_id', 'padre_id'];

    public $timestamps = false; // Esta tabla no tiene timestamps
}
