<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';
    protected $primaryKey = 'notificacion_id';

    // Campos asignables en masa
    protected $fillable = ['usuario_id', 'estudiante_id', 'mensaje', 'leido'];

    public $timestamps = true;

    // Relación con usuarios
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'user_id');
    }

    // Relación con estudiantes
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'estudiante_id', 'estudiante_id');
    }
}
