<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EstudiantePadre;
use Illuminate\Support\Facades\Log;

class EstudiantePadresController extends Controller
{
    // Obtener todas las relaciones maestro-curso
    public function apiIndex()
    {
        $relaciones = EstudiantePadre::all();
        return response()->json($relaciones, 200);
    }


        // Obtener todas las relaciones estudiante-padre
    public function index()
    {
        
        $relaciones = EstudiantePadre::all();
        return view('estudiantepadres', compact('relaciones'));
    }

    // Guardar una nueva relación estudiante-padre
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
            'padre_id' => 'required|exists:usuarios,user_id',
        ]);

        try {
            $relacion = EstudiantePadre::create($validatedData);
            return response()->json($relacion, 201);
        } catch (\Exception $e) {
            Log::error('Error al crear relación estudiante-padre: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al crear relación estudiante-padre'], 500);
        }
    }

    // Actualizar una relación estudiante-padre
    public function update(Request $request, $estudiante_id, $padre_id)
    {
        $relacion = EstudiantePadre::where('estudiante_id', $estudiante_id)->where('padre_id', $padre_id)->first();
        if (!$relacion) {
            return response()->json(['message' => 'Relación no encontrada'], 404);
        }

        $validatedData = $request->validate([
            'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
            'padre_id' => 'required|exists:usuarios,user_id',
        ]);

        try {
            $relacion->update($validatedData);
            return response()->json($relacion, 200);
        } catch (\Exception $e) {
            Log::error('Error al actualizar relación estudiante-padre: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al actualizar relación estudiante-padre'], 500);
        }
    }

    // Eliminar una relación estudiante-padre
    public function destroy($estudiante_id, $padre_id)
    {
        $relacion = EstudiantePadre::where('estudiante_id', $estudiante_id)->where('padre_id', $padre_id)->first();
        if (!$relacion) {
            return response()->json(['message' => 'Relación no encontrada'], 404);
        }

        try {
            $relacion->delete();
            return response()->json(['message' => 'Relación eliminada exitosamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error al eliminar relación estudiante-padre: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al eliminar relación estudiante-padre'], 500);
        }
    }
}
