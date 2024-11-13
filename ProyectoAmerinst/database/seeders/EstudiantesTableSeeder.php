<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class EstudiantesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create(); // Utilizando Faker para generar datos falsos

        // Creamos 30 estudiantes
        for ($i = 0; $i < 30; $i++) {
            DB::table('estudiantes')->insert([
                'nombre' => $faker->firstName,  // Genera un nombre falso
                'apellido' => $faker->lastName, // Genera un apellido falso
                'fecha_nacimiento' => $faker->date('Y-m-d', '2005-01-01'), // Fecha de nacimiento aleatoria
                'curso_id' => rand(1, 3),  // Asocia al curso con un valor aleatorio entre 1 y 3
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
