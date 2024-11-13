<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AsistenciaController extends Controller
{
    // Obtener todas las asistencias (opcionalmente filtradas por estudiante)
    public function apiIndex(Request $request)
    {
        $query = Asistencia::query();

        if ($request->has('estudiante_id')) {
            $query->where('estudiante_id', $request->input('estudiante_id'));
        }

        $asistencias = $query->get();
        return response()->json($asistencias, 200);
    }

    // Mostrar la vista HTML
    public function index()
    {
        return view('asistencias');
    }

    // Obtener asistencias por estudiante, curso y mes específico
    public function obtenerAsistenciasPorEstudianteYMes(Request $request)
    {
        $validated = $request->validate([
            'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
            'curso_id' => 'required|exists:cursos,curso_id',
            'mes' => 'required|integer|min:1|max:12',
            'ano' => 'required|integer|min:1900|max:2100'
        ]);

        $asistencias = Asistencia::where('estudiante_id', $validated['estudiante_id'])
            ->where('curso_id', $validated['curso_id'])
            ->whereMonth('fecha', $validated['mes'])
            ->whereYear('fecha', $validated['ano'])
            ->get();

        return response()->json($asistencias, 200);
    }

    // Crear o actualizar asistencias en bloque
    public function store(Request $request)
{
    $data = $request->validate([
        'asistencias' => 'required|array',
        'asistencias.*.estudiante_id' => 'required|exists:estudiantes,estudiante_id',
        'asistencias.*.curso_id' => 'required|exists:cursos,curso_id',
        'asistencias.*.estado' => 'required|string|max:1',
    ]);

    foreach ($data['asistencias'] as $asistenciaData) {
        // Verificar si ya existe una asistencia para el estudiante con el curso y fecha actual
        $existingAsistencia = Asistencia::where('estudiante_id', $asistenciaData['estudiante_id'])
            ->where('curso_id', $asistenciaData['curso_id'])
            ->whereDate('created_at', now()->toDateString())  // Compara solo la fecha de created_at
            ->first();

        if ($existingAsistencia) {
            // Si existe, actualizamos el estado
            $existingAsistencia->update([
                'estado' => $asistenciaData['estado'],
            ]);
        } else {
            // Si no existe, creamos una nueva entrada
            Asistencia::create([
                'estudiante_id' => $asistenciaData['estudiante_id'],
                'curso_id' => $asistenciaData['curso_id'],
                'estado' => $asistenciaData['estado'],
                // 'fecha' no es necesario porque created_at se asigna automáticamente
            ]);
        }
    }

    return response()->json(['message' => 'Asistencias procesadas correctamente'], 200);
}





    // Actualizar una asistencia específica
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
        return response()->json($asistencia->fresh());
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
