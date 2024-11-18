<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AsistenciasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $data = [];

        // Generar 100 registros de asistencias
        for ($i = 1; $i <= 100; $i++) {
            $data[] = [
                'estudiante_id' => $faker->numberBetween(1, 30), // ID de estudiantes existentes
                'curso_id' => $faker->numberBetween(1, 3), // ID de cursos existentes
                'estado' => $faker->randomElement(['P', 'A', 'T']), // P = Presente, A = Ausente, T = Tarde
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insertar los datos generados en la tabla 'asistencias'
        DB::table('asistencias')->insert($data);

        // Mostrar mensaje en consola al finalizar el seeder
        $this->command->info('Asistencias generadas exitosamente.');
    }
}
