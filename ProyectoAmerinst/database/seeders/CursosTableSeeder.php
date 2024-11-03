<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CursosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cursos')->insert([
            [
                'nombre' => 'Rojo',    // Representa el color del grado
                'grado' => 'Primero',
            ],
            [
                'nombre' => 'Verde',
                'grado' => 'Segundo',
            ],
            [
                'nombre' => 'Azul',
                'grado' => 'Tercero',
            ],
        ]);
    }
}
