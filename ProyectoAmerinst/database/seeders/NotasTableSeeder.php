<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('notas')->insert([
            [
                'estudiante_id' => 1,    // ID del estudiante 'Luis Ramirez'
                'curso_id' => 1,         // ID del curso 'Rojo' (Primero)
                'materia_id' => 1,       // ID de la materia 'Matemáticas'
                'maestro_id' => 2,       // ID del maestro 'Maria Garcia'
                'nota' => 8.5,
                'fecha' => '2024-05-15',
                'observaciones' => 'Buen desempeño',
            ],
            [
                'estudiante_id' => 2,    // ID del estudiante 'Ana Fernandez'
                'curso_id' => 2,         // ID del curso 'Verde' (Segundo)
                'materia_id' => 2,       // ID de la materia 'Ciencias Naturales'
                'maestro_id' => 2,       // ID del maestro 'Maria Garcia'
                'nota' => 7.3,
                'fecha' => '2024-05-16',
                'observaciones' => 'Necesita mejorar en práctica',
            ],
            [
                'estudiante_id' => 3,    // ID del estudiante 'Pedro Gomez'
                'curso_id' => 3,         // ID del curso 'Azul' (Tercero)
                'materia_id' => 3,       // ID de la materia 'Historia'
                'maestro_id' => 3,       // ID del maestro 'Carlos Lopez'
                'nota' => 9.2,
                'fecha' => '2024-05-17',
                'observaciones' => 'Excelente comprensión',
            ]
        ]);
    }
}
