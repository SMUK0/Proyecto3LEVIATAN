<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function loginPadres(Request $request)
    {
        // Ejemplo básico de autenticación
        $username = $request->input('username');
        $password = $request->input('password');

        if ($username === 'padre' && $password === '123456') {
            // Guardar la autenticación en la sesión
            $request->session()->put('padre_logged_in', true);
            return redirect()->route('CrudPadres');
        } else {
            return redirect()->route('login')->with('error', 'Credenciales incorrectas');
        }
    }
}
