<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EstudianteController;

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
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
