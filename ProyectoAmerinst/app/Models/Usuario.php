<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens; // Importa el trait HasApiTokens

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory; // Agrega HasApiTokens al modelo

    protected $table = 'usuarios';
    protected $primaryKey = 'user_id'; // Especifica la clave primaria como 'user_id'

    // Campos asignables en masa
    protected $fillable = ['nombre', 'apellido', 'email', 'password', 'rol_id'];

    // Habilitar timestamps automáticos
    public $timestamps = true;

    // Relación con roles
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id', 'rol_id');
    }

    // Relación con estudiantes (para padres o maestros)
    public function estudiantes()
    {
        return $this->hasMany(Estudiante::class, 'user_id', 'user_id');
    }
    public function cursos()
{
    return $this->belongsToMany(Curso::class, 'maestro_curso', 'maestro_id', 'curso_id');
}


}
