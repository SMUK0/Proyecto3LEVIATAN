<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validar los campos de correo y contraseña
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar al usuario por su email
        $user = DB::table('usuarios')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        // Devolver la respuesta en formato JSON con el nombre, apellido y rol del usuario
        return response()->json([
            'rol' => $user->rol_id,
            'nombre' => $user->nombre,
            'apellido' => $user->apellido
        ]);
    }
}
