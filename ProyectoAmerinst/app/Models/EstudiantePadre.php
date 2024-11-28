<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstudiantePadre extends Model
{
    use HasFactory;

    protected $table = 'estudiante_padre';
    protected $primaryKey = ['estudiante_id', 'padre_id'];  // Clave primaria compuesta
    public $incrementing = false;  // Necesario para claves primarias compuestas
    protected $fillable = ['estudiante_id', 'padre_id'];

    // Deshabilitar los timestamps (created_at y updated_at)
    public $timestamps = false;

    // Relación con Estudiante
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'estudiante_id', 'estudiante_id');
    }

    // Relación con Usuario (Padre)
    public function padre()
    {
        return $this->belongsTo(Usuario::class, 'padre_id', 'user_id');
    }
}

