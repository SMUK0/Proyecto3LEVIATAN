<?php

use Illuminate\Support\Facades\Route;


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

Route::get('/', function () {
    return view('welcome');
});
//CRUD PADRES
Route::get('/CrudPadres', function () {
    return view('CrudPadres');
});


//LOGIN PADRES
use App\Http\Controllers\AuthController;


// Muestra el formulario de login para padres
// Ruta para mostrar el formulario de login para padres
Route::get('/loginPadres', function () {
    return view('LoginPadres');  // Esto cargará la vista 'LoginPadres.blade.php'
})->name('login');



// Procesa el login de padres (Controlador)
Route::post('/loginPadres', [AuthController::class, 'loginPadres'])->name('loginPadres');

// Ruta para el CRUD de padres
Route::get('/CrudPadres', function () {
    return view('CrudPadres');  // Asegúrate de tener la vista CrudPadres.blade.php en la carpeta resources/views
})->name('CrudPadres');






// Ruta para Login de Administradores
Route::get('/LoginAdministradores', function () {
    return view('LoginAdministradores');
})->name('loginAdministradores');

// Ruta para CRUD de Administradores
Route::get('/CrudAdministradores', function () {
    return view('CrudAdministradores');
})->name('crudAdministradores');


// Ruta para Login de Administrativos
Route::get('/LoginAdministrativos', function () {
    return view('LoginAdministrativos');
})->name('loginAdministrativos');

// Ruta para CRUD de Administrativos
Route::get('/CrudAdministrativos', function () {
    return view('CrudAdministrativos');
})->name('crudAdministrativos');





