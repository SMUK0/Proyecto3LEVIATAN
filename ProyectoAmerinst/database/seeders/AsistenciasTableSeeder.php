<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AsistenciasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('asistencias')->insert([
            [
                'estudiante_id' => 1,    // ID del estudiante 'Luis Ramirez'
                'curso_id' => 1,         // ID del curso 'Rojo' (Primero)
                'estado' => 'Presente',
                'observaciones' => 'Llegó a tiempo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'estudiante_id' => 2,    // ID del estudiante 'Ana Fernandez'
                'curso_id' => 2,         // ID del curso 'Verde' (Segundo)
                'estado' => 'Ausente',
                'observaciones' => 'Falta justificada',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'estudiante_id' => 3,    // ID del estudiante 'Pedro Gomez'
                'curso_id' => 3,         // ID del curso 'Azul' (Tercero)
                'estado' => 'Tarde',
                'observaciones' => 'Llegó 10 minutos tarde',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
