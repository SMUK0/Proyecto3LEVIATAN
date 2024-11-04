<?php

namespace App\Http\Controllers;

use App\Models\MaestroCurso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MaestroCursosController extends Controller
{
    public function apiIndex()
    {
        try {
            $maestroCursos = MaestroCurso::all();
            return response()->json($maestroCursos, 200);
        } catch (\Exception $e) {
            Log::error("Error al obtener maestro-cursos: " . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener maestro-cursos'], 500);
        }
    }

    public function index()
{
    return view('maestrocursos'); // Asegúrate de que la vista `maestrocursos.blade.php` existe en la carpeta `resources/views`
}


public function store(Request $request)
{
    $validatedData = $request->validate([
        'maestro_id' => 'required|exists:usuarios,user_id',
        'curso_id' => 'required|exists:cursos,curso_id',
    ]);

    // Verificar si ya existe la relación
    $exists = MaestroCurso::where('maestro_id', $validatedData['maestro_id'])
        ->where('curso_id', $validatedData['curso_id'])
        ->exists();

    if ($exists) {
        return response()->json(['message' => 'Esta relación ya existe'], 409);
    }

    try {
        $maestroCurso = MaestroCurso::create($validatedData);
        return response()->json($maestroCurso, 201);
    } catch (\Exception $e) {
        Log::error('Error al crear maestro-curso: ' . $e->getMessage());
        return response()->json(['message' => 'Error interno al crear maestro-curso'], 500);
    }
}



public function update(Request $request, $maestro_id, $curso_id)
{
    // Encontrar el registro maestro-curso con los identificadores proporcionados
    $maestroCurso = MaestroCurso::where('maestro_id', $maestro_id)
                                ->where('curso_id', $curso_id)
                                ->first();

    if (!$maestroCurso) {
        return response()->json(['message' => 'Relación Maestro-Curso no encontrada'], 404);
    }

    // Validar la entrada del formulario
    $validatedData = $request->validate([
        'maestro_id' => 'required|exists:usuarios,user_id',
        'curso_id' => 'required|exists:cursos,curso_id',
    ]);

    // Actualizar el registro
    $maestroCurso->update($validatedData);
    return response()->json($maestroCurso, 200);
}





    public function destroy($maestro_id, $curso_id)
    {
        Log::info("Intentando eliminar maestro-curso con maestro_id={$maestro_id} y curso_id={$curso_id}");
    
        try {
            // Verificar y eliminar la relación usando ambos campos como filtros
            $deleted = MaestroCurso::where('maestro_id', $maestro_id)
                                   ->where('curso_id', $curso_id)
                                   ->delete();
    
            if ($deleted) {
                Log::info("Relación Maestro-Curso eliminada correctamente: maestro_id={$maestro_id}, curso_id={$curso_id}");
                return response()->json(['message' => 'Maestro-Curso eliminado'], 200);
            } else {
                Log::warning("Relación Maestro-Curso no encontrada: maestro_id={$maestro_id}, curso_id={$curso_id}");
                return response()->json(['message' => 'Relación Maestro-Curso no encontrada'], 404);
            }
        } catch (\Exception $e) {
            Log::error("Error al eliminar maestro-curso: " . $e->getMessage());
            return response()->json(['message' => 'Error interno al eliminar maestro-curso'], 500);
        }
    }
    


}
