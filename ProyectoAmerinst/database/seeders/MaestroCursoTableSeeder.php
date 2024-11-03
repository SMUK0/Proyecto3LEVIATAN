<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MaestroCursoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('maestro_curso')->insert([
            [
                'maestro_id' => 2,  // ID del maestro 'Maria Garcia'
                'curso_id' => 1,    // ID del curso 'Rojo' (Primero)
            ],
            [
                'maestro_id' => 2,  // ID del maestro 'Maria Garcia'
                'curso_id' => 2,    // ID del curso 'Verde' (Segundo)
            ],
            [
                'maestro_id' => 3,  // ID del maestro 'Carlos Lopez'
                'curso_id' => 3,    // ID del curso 'Azul' (Tercero)
            ]
        ]);
    }
}
