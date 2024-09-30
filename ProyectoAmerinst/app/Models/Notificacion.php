<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';
    protected $primaryKey = 'notificacion_id';

    protected $fillable = [
        'usuario_id',
        'estudiante_id',
        'mensaje',
        'leido'
    ];

    public $timestamps = false;  // Si no tienes columnas created_at y updated_at
}
