<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class NotasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Obtener datos válidos de las tablas relacionadas
        $estudiantes = DB::table('estudiantes')->pluck('estudiante_id')->toArray();
        $cursos = DB::table('cursos')->pluck('curso_id')->toArray();
        $materias = DB::table('materias')->pluck('materia_id')->toArray();
        $maestros = DB::table('usuarios')->where('rol_id', 2)->pluck('user_id')->toArray(); // Asumiendo que rol_id 2 es maestro

        $data = [];

        for ($i = 1; $i <= 300; $i++) { // Generar 100 registros
            $data[] = [
                'estudiante_id' => $faker->randomElement($estudiantes),
                'curso_id' => $faker->randomElement($cursos),
                'materia_id' => $faker->randomElement($materias),
                'maestro_id' => $faker->randomElement($maestros),
                'nota' => $faker->randomFloat(2, 1, 10), // Nota entre 0 y 10
                'tipo' => $faker->randomElement(['Tarea', 'Examen']),
                'bimestre' => $faker->numberBetween(1, 4), // Bimestre entre 1 y 4
                'observaciones' => $faker->optional()->sentence(), // Opcional

            ];
        }

        DB::table('notas')->insert($data);
    }
}
