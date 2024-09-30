<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    protected $table = 'materias';

    protected $primaryKey = 'materia_id';

    protected $fillable = ['nombre'];

    public $timestamps = false; // Si no tienes columnas created_at y updated_at
}
