<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CursoController extends Controller
{
    // Método para devolver JSON para la API
    public function apiIndex()
    {
        $cursos = Curso::all();
        return response()->json($cursos, 200);
    }

    // Método para devolver la vista HTML
    public function index()
    {
        $cursos = Curso::all();
        return view('cursos', compact('cursos'));
    }

    // Crear un nuevo curso
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|max:50',
            'grado' => 'required|max:50',
        ]);

        try {
            $curso = Curso::create($validatedData);
            return response()->json($curso, 201);  // Retorna el curso creado
        } catch (\Exception $e) {
            Log::error('Error al crear curso: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'validated_data' => $validatedData
            ]);

            return response()->json(['message' => 'Error interno al crear curso'], 500);  // Error 500
        }
    }

    // Obtener un curso por ID
    public function show($id)
    {
        $curso = Curso::find($id);
        if (!$curso) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }
        return response()->json($curso);
    }

    // Actualizar un curso
    public function update(Request $request, $id)
    {
        $curso = Curso::find($id);
        if (!$curso) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'nombre' => 'sometimes|required|max:50',
            'grado' => 'sometimes|required|max:50',
        ]);

        $curso->update($validatedData);
        return response()->json($curso);
    }

    // Eliminar un curso
    public function destroy($id)
    {
        $curso = Curso::find($id);
        if (!$curso) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }

        $curso->delete();
        return response()->json(['message' => 'Curso eliminado']);
    }
}
