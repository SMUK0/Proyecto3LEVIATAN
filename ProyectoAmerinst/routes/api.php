<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\EstudiantePadresController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\MaestroCursosController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
/* Usuario */
Route::get('/usuarios', [UsuarioController::class, 'apiIndex']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
/* Estudiante */
Route::get('/estudiantes', [EstudianteController::class, 'apiIndex']);
Route::post('/estudiantes', [EstudianteController::class, 'store']);
Route::get('/estudiantes/{id}', [EstudianteController::class, 'show']);
Route::put('/estudiantes/{id}', [EstudianteController::class, 'update']);
Route::delete('/estudiantes/{id}', [EstudianteController::class, 'destroy']);
/* Curso */
Route::get('/cursos', [CursoController::class, 'apiIndex']);
Route::post('/cursos', [CursoController::class, 'store']);
Route::get('/cursos/{id}', [CursoController::class, 'show']);
Route::put('/cursos/{id}', [CursoController::class, 'update']);
Route::delete('/cursos/{id}', [CursoController::class, 'destroy']);
/* Materia */
Route::get('/materias', [MateriaController::class, 'apiIndex']);
Route::post('/materias', [MateriaController::class, 'store']);
Route::get('/materias/{id}', [MateriaController::class, 'show']);
Route::put('/materias/{id}', [MateriaController::class, 'update']);
Route::delete('/materias/{id}', [MateriaController::class, 'destroy']);
/* Nota */
Route::get('/notas', [NotaController::class, 'apiIndex']);
Route::post('/notas', [NotaController::class, 'store']);
Route::get('/notas/{id}', [NotaController::class, 'show']);
Route::put('/notas/{id}', [NotaController::class, 'update']);
Route::delete('/notas/{id}', [NotaController::class, 'destroy']);
/* Asistencia */
Route::get('/asistencias', [AsistenciaController::class, 'apiIndex']);
Route::post('/asistencias',[AsistenciaController::class, 'store']);
Route::get('/asistencias/{id}', [AsistenciaController::class, 'show']);
Route::put('/asistencias/{id}', [AsistenciaController::class, 'update']);
Route::delete('/asistencias/{id}', [AsistenciaController::class, 'destroy']);
/* Notificacion */
Route::get('/notificaciones', [NotificacionController::class, 'apiIndex']);
Route::post('/notificaciones',[NotificacionController::class, 'store']);
Route::get('/notificaciones/{id}', [NotificacionController::class, 'show']);
Route::put('/notificaciones/{id}', [NotificacionController::class, 'update']);
Route::delete('/notificaciones/{id}', [NotificacionController::class, 'destroy']);
/* Maestro-Cursos */
Route::get('/maestro-cursos', [MaestroCursosController::class, 'apiIndex']);
Route::post('/maestro-cursos',[MaestroCursosController::class, 'store']);
Route::get('/maestro-cursos/{maestro_id}/{curso_id}', [MaestroCursosController::class, 'show']);
Route::put('/maestro-cursos/{maestro_id}/{curso_id}', [MaestroCursosController::class, 'update']);
Route::delete('/maestro-cursos/{maestro_id}/{curso_id}', [MaestroCursosController::class, 'destroy']);

/* Estudiante-Padres */
Route::get('/estudiante-padres', [EstudiantePadresController::class, 'apiIndex']);
Route::post('/estudiante-padres',[EstudiantePadresController::class, 'store']);
Route::get('/estudiante-padres/{maestro_id}/{curso_id}', [EstudiantePadresController::class, 'show']);
Route::put('/estudiante-padres/{estudiante_id}/{padre_id}', [EstudiantePadresController::class, 'update']);
Route::delete('/estudiante-padres/{estudiante_id}/{padre_id}', [EstudiantePadresController::class, 'destroy']);




Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
