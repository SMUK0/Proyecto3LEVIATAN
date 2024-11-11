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

    // Lista de palabras prohibidas
private $palabrasProhibidas = ['groseria1', 'groseria2', 'groseria3']; // reemplaza con palabras específicas

    // Crear un nuevo usuario
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'nombre' => [
            'required',
            'max:100',
            'regex:/^[a-zA-Z\s]+$/',
            function ($attribute, $value, $fail) {
                if (preg_match('/^(.)\1*$/', $value)) {
                    $fail("El $attribute no puede contener un solo carácter repetido.");
                }
                foreach ($this->palabrasProhibidas as $palabra) {
                    if (stripos($value, $palabra) !== false) {
                        $fail("El $attribute contiene palabras no permitidas.");
                    }
                }
            }
        ],
        'apellido' => [
            'required',
            'max:100',
            'regex:/^[a-zA-Z\s]+$/',
            function ($attribute, $value, $fail) {
                if (preg_match('/^(.)\1*$/', $value)) {
                    $fail("El $attribute no puede contener un solo carácter repetido.");
                }
                foreach ($this->palabrasProhibidas as $palabra) {
                    if (stripos($value, $palabra) !== false) {
                        $fail("El $attribute contiene palabras no permitidas.");
                    }
                }
            }
        ],
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|min:8|regex:/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/',
        'rol_id' => 'required|integer|exists:roles,rol_id',
    ]);

    $validatedData['password'] = bcrypt($request->password);
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

    // Validar los datos, permitiendo que la contraseña sea opcional
    $validatedData = $request->validate([
        'nombre' => 'sometimes|required|max:100',
        'apellido' => 'sometimes|required|max:100',
        'email' => 'sometimes|required|email|unique:usuarios,email,' . $id . ',user_id',
        'password' => [
            'nullable',
            'min:8',
            'regex:/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/'
        ],
        'rol_id' => 'sometimes|required|integer|exists:roles,rol_id'
    ]);

    // Solo encriptar y actualizar la contraseña si se proporciona
    if ($request->filled('password')) {
        $validatedData['password'] = bcrypt($request->password); // Guardar en el campo 'password'
    } else {
        unset($validatedData['password']); // Remover el campo si está vacío
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
