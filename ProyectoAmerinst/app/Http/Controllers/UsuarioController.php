<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    // Obtener todos los usuarios
    // Método para devolver JSON para la API
    public function apiIndex()
    {
        $usuarios = usuario::all();
        return response()->json($usuarios, 200);
    }

    // Método para devolver la vista HTML
    public function index()
    {
        $usuarios = usuario::all();
        return view('usuarios', data: compact('usuarios'));
    }

    // Crear un nuevo usuario
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'nombre' => 'required|max:100',
        'apellido' => 'required|max:100',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|min:8',
        'rol_id' => 'required|integer'
    ]);

    $validatedData['password_hash'] = bcrypt($request->password);

    $usuario = Usuario::create($validatedData);

    return response()->json($usuario, 201);
}


    // Obtener un usuario por ID
    public function show($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return response()->json($usuario, 200);
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
{
    $usuario = Usuario::find($id);
    if (!$usuario) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    // Validar los datos, asegurando que no se requiere una nueva contraseña si no se provee
    $validatedData = $request->validate([
        'nombre' => 'sometimes|required|max:100',
        'apellido' => 'sometimes|required|max:100',
'email' => 'sometimes|required|email|unique:usuarios,email,' . $id . ',user_id',
        'password' => 'nullable|min:8', // Hacer que la contraseña sea opcional en la actualización
        'rol_id' => 'sometimes|required|integer|exists:roles,rol_id'
    ]);

    // Solo encriptar la contraseña si fue provista
    if ($request->filled('password')) {
        $validatedData['password_hash'] = bcrypt($request->password);
    }

    // Actualizar el usuario
    $usuario->update($validatedData);

    return response()->json($usuario, 200);
}


    // Eliminar un usuario
    public function destroy($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);
    }
}
