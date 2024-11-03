<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
{
    $this->call([
        RolesTableSeeder::class,
        UsuariosTableSeeder::class,
        CursosTableSeeder::class,
        EstudiantesTableSeeder::class,
        EstudiantePadreTableSeeder::class,
        MateriasTableSeeder::class,
        MaestroCursoTableSeeder::class,
        NotasTableSeeder::class,
        AsistenciasTableSeeder::class,
        ObservacionesTableSeeder::class,
        NotificacionesTableSeeder::class,
    ]);
}

}
