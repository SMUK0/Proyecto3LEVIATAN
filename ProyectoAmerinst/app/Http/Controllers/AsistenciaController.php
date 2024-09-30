<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AsistenciaController extends Controller
{
    // Obtener todas las asistencias
    public function apiIndex()
    {
        return response()->json(Asistencia::all(), 200);
    }

    // Mostrar la vista HTML
    public function index()
    {
        return view('asistencias');
    }

    // Crear una nueva asistencia
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
            'curso_id' => 'required|exists:cursos,curso_id',
            'fecha' => 'required|date',
            'estado' => 'required|string|max:20',
            'observaciones' => 'nullable|string'
        ]);

        try {
            $asistencia = Asistencia::create($validatedData);
            return response()->json($asistencia, 201);
        } catch (\Exception $e) {
            Log::error('Error al crear asistencia: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al crear la asistencia'], 500);
        }
    }

    // Obtener una asistencia por ID
    public function show($id)
    {
        $asistencia = Asistencia::find($id);
        if (!$asistencia) {
            return response()->json(['message' => 'Asistencia no encontrada'], 404);
        }
        return response()->json($asistencia);
    }

    // Actualizar una asistencia
    public function update(Request $request, $id)
    {
        $asistencia = Asistencia::find($id);
        if (!$asistencia) {
            return response()->json(['message' => 'Asistencia no encontrada'], 404);
        }

        $validatedData = $request->validate([
            'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
            'curso_id' => 'required|exists:cursos,curso_id',
            'fecha' => 'required|date',
            'estado' => 'required|string|max:20',
            'observaciones' => 'nullable|string'
        ]);

        $asistencia->update($validatedData);
        return response()->json($asistencia);
    }

    // Eliminar una asistencia
    public function destroy($id)
    {
        $asistencia = Asistencia::find($id);
        if (!$asistencia) {
            return response()->json(['message' => 'Asistencia no encontrada'], 404);
        }

        $asistencia->delete();
        return response()->json(['message' => 'Asistencia eliminada']);
    }
}
