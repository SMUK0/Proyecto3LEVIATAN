<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstudiantesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('estudiantes')->insert([
            [
                'nombre' => 'Luis',
                'apellido' => 'Ramirez',
                'fecha_nacimiento' => '2010-05-12',
                'curso_id' => 1,  // Asocia al curso con color Rojo (Primero)
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ana',
                'apellido' => 'Fernandez',
                'fecha_nacimiento' => '2011-08-20',
                'curso_id' => 2,  // Asocia al curso con color Verde (Segundo)
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Pedro',
                'apellido' => 'Gomez',
                'fecha_nacimiento' => '2012-03-15',
                'curso_id' => 3,  // Asocia al curso con color Azul (Tercero)
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
