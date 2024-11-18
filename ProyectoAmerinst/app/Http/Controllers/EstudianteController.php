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
        // Cargar estudiantes con la relación 'curso' para obtener el nombre del curso
        $estudiantes = Estudiante::with('curso')->get();
        return response()->json($estudiantes, 200);
    }

    // Método para devolver la vista HTML
    public function index()
    {
        // Cargar estudiantes con la relación 'curso' para la vista
        $estudiantes = Estudiante::with('curso')->get();
        return view('estudiantes', compact('estudiantes'));
    }

    public function getEstudiantesRelacionados($padreId)
    {
        try {
            // Recuperar estudiantes relacionados con el padre
            $estudiantes = Estudiante::whereHas('padres', function ($query) use ($padreId) {
                $query->where('usuarios.user_id', $padreId);
            })->select('estudiante_id', 'nombre', 'apellido', 'curso_id')->get(); // Seleccionar solo columnas necesarias
    
            if ($estudiantes->isEmpty()) {
                return response()->json(['message' => 'No hay estudiantes relacionados.'], 404);
            }
    
            return response()->json($estudiantes, 200);
        } catch (\Exception $e) {
            // Registrar el error en los logs
            \Log::error('Error al obtener estudiantes relacionados: ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Error al obtener estudiantes relacionados.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    





    // Crear un nuevo estudiante
    public function store(Request $request)
    {
        try {
            // Validación de los datos (reemplazar 'grado' por 'curso_id')
            $validatedData = $request->validate([
                'nombre' => 'required|max:100',
                'apellido' => 'required|max:100',
                'fecha_nacimiento' => 'required|date',
                'curso_id' => 'required|exists:cursos,curso_id',  // Asegurar que curso_id exista en la tabla 'cursos'
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
        // Cargar el estudiante con su curso
        $estudiante = Estudiante::with('curso')->find($id);
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

        // Validar el curso_id en lugar de grado
        $validatedData = $request->validate([
            'nombre' => 'sometimes|required|max:100',
            'apellido' => 'sometimes|required|max:100',
            'fecha_nacimiento' => 'sometimes|required|date',
            'curso_id' => 'sometimes|required|exists:cursos,curso_id',  // Asegurar que curso_id exista
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
