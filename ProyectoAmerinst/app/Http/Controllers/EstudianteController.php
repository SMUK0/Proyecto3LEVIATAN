<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class EstudianteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function apiIndex()
    {
        $estudiantes = estudiante::all();
        return response()->json($estudiantes, 200);
    }

    // Método para devolver la vista HTML
    public function index()
    {
        $estudiantes = Estudiante::all();
        return view('estudiantes', compact('estudiantes'));
    }

    // Crear un nuevo estudiante
    public function store(Request $request)
    {
        try {
            // Validación de los datos
            $validatedData = $request->validate([
                'nombre' => 'required|max:100',
                'apellido' => 'required|max:100',
                'fecha_nacimiento' => 'required|date',
                'grado' => 'required|max:50',
            ]);
    
            // Intentar crear el estudiante
            $estudiante = Estudiante::create($validatedData);
            return response()->json($estudiante, 201);  // Retorna el estudiante creado
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación al crear estudiante: ', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Registrar cualquier otro error
            Log::error('Error al crear estudiante: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'validated_data' => $validatedData ?? 'No data validated'
            ]);
    
            return response()->json(['message' => 'Error interno al crear estudiante'], 500);
        }
    }

    // Obtener un estudiante por ID
    public function show($id)
    {
        $estudiante = Estudiante::find($id);
        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }
        return response()->json($estudiante);
    }

    // Actualizar un estudiante
    public function update(Request $request, $id)
    {
        $estudiante = Estudiante::find($id);
        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'nombre' => 'sometimes|required|max:100',
            'apellido' => 'sometimes|required|max:100',
            'fecha_nacimiento' => 'sometimes|required|date',
            'grado' => 'sometimes|required|max:50',
        ]);

        $estudiante->update($validatedData);
        return response()->json($estudiante);
    }

    // Eliminar un estudiante
    public function destroy($id)
    {
        $estudiante = Estudiante::find($id);
        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        $estudiante->delete();
        return response()->json(['message' => 'Estudiante eliminado']);
    }
}
