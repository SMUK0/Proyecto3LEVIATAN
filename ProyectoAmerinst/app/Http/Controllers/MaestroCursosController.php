<?php

namespace App\Http\Controllers;

use App\Models\MaestroCurso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MaestroCursosController extends Controller
{
    // Obtener todas las relaciones maestro-curso
    public function apiIndex()
    {
        $maestroCursos = MaestroCurso::all();
        return response()->json($maestroCursos, 200);
    }

     // Método para devolver la vista HTML
     public function index()
     {
         $maestroCursos = MaestroCurso::all();
         return view('maestrocursos', compact('maestroCursos'));
     }

    // Crear una nueva relación maestro-curso
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'maestro_id' => 'required|exists:usuarios,user_id',
            'curso_id' => 'required|exists:cursos,curso_id',
        ]);

        try {
            $maestroCurso = MaestroCurso::create($validatedData);
            return response()->json($maestroCurso, 201);
        } catch (\Exception $e) {
            Log::error('Error al crear maestro-curso: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al crear maestro-curso'], 500);
        }
    }

    // Obtener una relación maestro-curso por ID
    public function show($id)
    {
        $maestroCurso = MaestroCurso::find($id);
        if (!$maestroCurso) {
            return response()->json(['message' => 'Relación Maestro-Curso no encontrada'], 404);
        }
        return response()->json($maestroCurso);
    }

    // Actualizar maestro-curso
public function update(Request $request, $maestro_id, $curso_id)
{
    $maestroCurso = MaestroCurso::where('maestro_id', $maestro_id)->where('curso_id', $curso_id)->first();
    if (!$maestroCurso) {
        return response()->json(['message' => 'Relación Maestro-Curso no encontrada'], 404);
    }

    $validatedData = $request->validate([
        'maestro_id' => 'required|exists:usuarios,user_id',
        'curso_id' => 'required|exists:cursos,curso_id',
    ]);

    $maestroCurso->update($validatedData);
    return response()->json($maestroCurso);
}

// Eliminar maestro-curso
public function destroy($maestro_id, $curso_id)
{
    $maestroCurso = MaestroCurso::where('maestro_id', $maestro_id)->where('curso_id', $curso_id)->first();
    if (!$maestroCurso) {
        return response()->json(['message' => 'Relación Maestro-Curso no encontrada'], 404);
    }

    $maestroCurso->delete();
    return response()->json(['message' => 'Maestro-Curso eliminado']);
}
}
