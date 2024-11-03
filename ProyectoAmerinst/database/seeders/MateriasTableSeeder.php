<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MateriasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('materias')->insert([
            ['nombre' => 'Matemáticas'],
            ['nombre' => 'Ciencias Naturales'],
            ['nombre' => 'Historia'],
            ['nombre' => 'Geografía'],
            ['nombre' => 'Lengua y Literatura'],
        ]);
    }
}
