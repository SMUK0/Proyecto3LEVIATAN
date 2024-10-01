<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaestroCurso extends Model
{
    use HasFactory;

    protected $table = 'maestro_curso';
    protected $primaryKey = ['maestro_id', 'curso_id'];
    public $incrementing = false;

    protected $fillable = [
        'maestro_id',
        'curso_id'
    ];

    public $timestamps = false;
}
