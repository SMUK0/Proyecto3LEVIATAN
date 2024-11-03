<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificacionesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('notificaciones')->insert([
            [
                'usuario_id' => 1,          // ID del usuario 'Juan Perez'
                'estudiante_id' => 1,       // ID del estudiante 'Luis Ramirez'
                'mensaje' => 'El estudiante ha obtenido una nota excelente en el último examen.',
                'leido' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'usuario_id' => 2,          // ID del usuario 'Maria Garcia'
                'estudiante_id' => 2,       // ID del estudiante 'Ana Fernandez'
                'mensaje' => 'El estudiante estuvo ausente en la clase de Ciencias Naturales.',
                'leido' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'usuario_id' => 3,          // ID del usuario 'Carlos Lopez'
                'estudiante_id' => 3,       // ID del estudiante 'Pedro Gomez'
                'mensaje' => 'El estudiante mostró excelente comportamiento durante la actividad de historia.',
                'leido' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
