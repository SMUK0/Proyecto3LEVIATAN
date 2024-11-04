<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuariosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('usuarios')->insert([
            [
                'nombre' => 'Juan',
                'apellido' => 'Perez',
                'email' => 'juan.perez@gmail.com',
                'password' => Hash::make('pass123'),  // Cambiado de 'password_hash' a 'password'
                'rol_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Maria',
                'apellido' => 'Garcia',
                'email' => 'maria.garcia@gmail.com',
                'password' => Hash::make('pass123'),
                'rol_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Carlos',
                'apellido' => 'Lopez',
                'email' => 'carlos.lopez@gmail.com',
                'password' => Hash::make('pass123'),
                'rol_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
