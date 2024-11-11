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

    try {
        // Verificar si ya existe la relación
        $exists = MaestroCurso::where('maestro_id', $validatedData['maestro_id'])
            ->where('curso_id', $validatedData['curso_id'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Esta relación ya existe'], 409);
        }

        // Crear la relación maestro-curso
        $maestroCurso = new MaestroCurso();
        $maestroCurso->maestro_id = $validatedData['maestro_id'];
        $maestroCurso->curso_id = $validatedData['curso_id'];
        $maestroCurso->save();

        return response()->json($maestroCurso, 201);

    } catch (\Exception $e) {
        Log::error('Error al crear maestro-curso: ' . $e->getMessage());
        return response()->json(['message' => 'Error interno al crear maestro-curso'], 500);
    }
}



public function update(Request $request, $maestro_id, $curso_id)
{
    try {
        Log::info("Intentando actualizar Maestro-Curso con maestro_id={$maestro_id}, curso_id={$curso_id}");

        // Validar los datos
        $validatedData = $request->validate([
            'maestro_id' => 'required|exists:usuarios,user_id',
            'curso_id' => 'required|exists:cursos,curso_id',
        ]);

        Log::info("Datos validados para actualización", ['validatedData' => $validatedData]);

        // Buscar y eliminar el registro existente
        MaestroCurso::where('maestro_id', $maestro_id)
                    ->where('curso_id', $curso_id)
                    ->delete();

        Log::info("Eliminando relación Maestro-Curso existente para actualizar");

        // Crear un nuevo registro con los datos actualizados
        $newMaestroCurso = MaestroCurso::create($validatedData);

        Log::info("Relación Maestro-Curso actualizada exitosamente", ['newData' => $newMaestroCurso]);

        return response()->json($newMaestroCurso, 200);
    } catch (\Exception $e) {
        Log::error("Error al actualizar Maestro-Curso: " . $e->getMessage());
        return response()->json(['message' => 'Error interno al actualizar maestro-curso'], 500);
    }
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
