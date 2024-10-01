<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstudiantePadre extends Model
{
    use HasFactory;
    protected $table = 'estudiante_padre';

    // No necesitamos las columnas de timestamp (created_at, updated_at)
    public $timestamps = false;

    // La tabla no tiene una clave primaria auto-incremental
    protected $primaryKey = ['estudiante_id', 'padre_id'];
    public $incrementing = false;

    protected $fillable = [
        'estudiante_id',
        'padre_id',
    ];

    // Definir relaciones
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'estudiante_id');
    }

    public function padre()
    {
        return $this->belongsTo(Usuario::class, 'padre_id');
    }
}
