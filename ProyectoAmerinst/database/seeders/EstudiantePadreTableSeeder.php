<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class EstudiantePadreTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Obtener los IDs existentes de estudiantes y padres
        $estudiantesIds = DB::table('estudiantes')->pluck('estudiante_id')->toArray();
        $padresIds = DB::table('usuarios')->where('rol_id', 3)->pluck('user_id')->toArray(); // Filtrar padres por rol_id

        if (empty($estudiantesIds) || empty($padresIds)) {
            throw new \Exception('No hay estudiantes o padres en la base de datos para generar relaciones.');
        }

        $data = [];
        $relacionesUnicas = []; // Usaremos este array para verificar duplicados

        // Generar 30 relaciones únicas aleatorias
        while (count($data) < 30) {
            $estudianteId = $faker->randomElement($estudiantesIds);
            $padreId = $faker->randomElement($padresIds);

            $relacion = "$estudianteId-$padreId"; // Crear una clave única

            // Solo agrega la relación si no existe ya
            if (!isset($relacionesUnicas[$relacion])) {
                $data[] = [
                    'estudiante_id' => $estudianteId,
                    'padre_id' => $padreId,
                ];
                $relacionesUnicas[$relacion] = true; // Marca la relación como usada
            }
        }

        // Insertar las relaciones generadas
        DB::table('estudiante_padre')->insert($data);
    }
}
