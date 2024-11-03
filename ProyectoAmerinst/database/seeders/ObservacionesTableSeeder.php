<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ObservacionesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('observaciones')->insert([
            [
                'estudiante_id' => 1,    // ID del estudiante 'Luis Ramirez'
                'curso_id' => 1,         // ID del curso 'Rojo' (Primero)
                'maestro_id' => 2,       // ID del maestro 'Maria Garcia'
                'descripcion' => 'Participa activamente en clase',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'estudiante_id' => 2,    // ID del estudiante 'Ana Fernandez'
                'curso_id' => 2,         // ID del curso 'Verde' (Segundo)
                'maestro_id' => 2,       // ID del maestro 'Maria Garcia'
                'descripcion' => 'Requiere apoyo en temas específicos',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'estudiante_id' => 3,    // ID del estudiante 'Pedro Gomez'
                'curso_id' => 3,         // ID del curso 'Azul' (Tercero)
                'maestro_id' => 3,       // ID del maestro 'Carlos Lopez'
                'descripcion' => 'Excelente actitud y disposición para aprender',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
