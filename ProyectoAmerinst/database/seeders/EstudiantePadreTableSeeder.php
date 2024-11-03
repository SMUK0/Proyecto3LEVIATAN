<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstudiantePadreTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('estudiante_padre')->insert([
            [
                'estudiante_id' => 1,  // ID del estudiante 'Luis Ramirez'
                'padre_id' => 3,       // ID del usuario 'Carlos Lopez'
            ],
            [
                'estudiante_id' => 2,  // ID del estudiante 'Ana Fernandez'
                'padre_id' => 2,       // ID del usuario 'Maria Garcia'
            ],
            [
                'estudiante_id' => 3,  // ID del estudiante 'Pedro Gomez'
                'padre_id' => 1,       // ID del usuario 'Juan Perez'
            ]
        ]);
    }
}
