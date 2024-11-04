<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Método para iniciar sesión
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Intentar autenticación
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate(); // Regenerar la sesión

            $user = Auth::user();
            return response()->json([
                'user_id' => $user->user_id,
                'rol_id' => $user->rol_id,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido
            ]);
        }

        return response()->json(['error' => 'Credenciales incorrectas'], 401);
    }

    // Método para obtener el usuario autenticado
    public function getUser(Request $request)
{
    if (Auth::check()) {
        $user = Auth::user();
        return response()->json([
            'user_id' => $user->user_id,
            'rol_id' => $user->rol_id,
            'nombre' => $user->nombre,
            'apellido' => $user->apellido
        ]);
    }

    return response()->json(['error' => 'Usuario no autenticado'], 401);
}


    // Método para cerrar sesión
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
