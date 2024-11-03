<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $primaryKey = 'rol_id';

    // Campos asignables en masa
    protected $fillable = ['nombre'];

    public $timestamps = false; // Esta tabla no tiene timestamps

    // Relación con usuarios
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'rol_id', 'rol_id');
    }
}
