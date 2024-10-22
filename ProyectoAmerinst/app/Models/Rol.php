<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    // Definir la tabla asociada al modelo (por si el nombre de la tabla no sigue la convención "pluralizada")
    protected $table = 'roles';

    // Indicar los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'nombre', // Campo de nombre del rol
    ];

    // Si deseas especificar las relaciones, puedes añadir métodos para relaciones aquí.
    // Ejemplo: si los roles están relacionados con usuarios
    public function usuarios()
    {
        return $this->hasMany(User::class, 'rol_id');
    }
}
