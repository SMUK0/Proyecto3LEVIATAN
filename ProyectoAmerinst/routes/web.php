<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\MaestroCursosController;
use App\Http\Controllers\EstudiantePadresController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
/* LOGIN */
Route::get('/login', function () {
    return view('login');
});

/* Vista Administrador */
Route::get('/administrador', function () {
    return view('view_administrador');
});
/* Vista Maestro */
Route::get('/maestro', function () {
    return view('view_maestro');
});

/* Usuario */
Route::get('/usuarios', [UsuarioController::class, 'index']);
/* Estudiante */
Route::get('/estudiantes', [EstudianteController::class, 'index']);
/* Curso */
Route::get('/cursos', [CursoController::class, 'index']);
/* Materia */
Route::get('/materias', [MateriaController::class, 'index']);
/* Nota */
Route::get('/notas', [NotaController::class, 'index']);
/* Asistencia */
Route::get('/asistencias', [AsistenciaController::class, 'index']);
/* Notificacion */
Route::get('/notificaciones', [NotificacionController::class, 'index']);
/* Maestro-Cursos */
Route::get('/maestro-cursos', [MaestroCursosController::class, 'index']);
/* Estudiante-Padres */
Route::get('/estudiante-padres', [EstudiantePadresController::class, 'index']);



Route::get('/', function () {
    return view('welcome');
});
