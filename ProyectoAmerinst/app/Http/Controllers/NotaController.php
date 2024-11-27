<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NotaController extends Controller
{
    // Obtener todas las notas
    public function apiIndex()
    {
        try {
            $notas = Nota::all(); // Recupera todas las notas
            return response()->json($notas, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener notas: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener las notas'], 500);
        }
    }




public function bulkSave(Request $request)
{
    try {
        $data = $request->validate([
            '*.estudiante_id' => 'required|exists:estudiantes,estudiante_id',
            '*.curso_id' => 'required|exists:cursos,curso_id',
            '*.materia_id' => 'required|exists:materias,materia_id',
            '*.maestro_id' => 'required|exists:usuarios,user_id',
            '*.nota' => 'required|numeric|min:0|max:10',
            '*.tipo' => 'required|string|in:Tarea,Examen',
            '*.bimestre' => 'required|integer|min:1|max:4',
        ]);

        foreach ($data as $notaData) {
            // Condiciones para encontrar una nota existente
            $existingNota = Nota::where([
                ['estudiante_id', $notaData['estudiante_id']],
                ['curso_id', $notaData['curso_id']],
                ['materia_id', $notaData['materia_id']],
                ['bimestre', $notaData['bimestre']],
                ['tipo', $notaData['tipo']]
            ])->first();

            if ($existingNota) {
                // Si existe, actualiza
                Log::info("Actualizando Nota", ['id' => $existingNota->id, 'nueva_data' => $notaData]);
                $existingNota->update(['nota' => $notaData['nota']]);
            } else {
                // Si no existe, crea una nueva
                Log::info("Creando nueva Nota", $notaData);
                Nota::create($notaData);
            }
        }

        return response()->json(['message' => 'Notas guardadas correctamente.'], 200);
    } catch (\Exception $e) {
        Log::error('Error al guardar notas: ' . $e->getMessage());
        return response()->json(['message' => 'Error al guardar las notas.'], 500);
    }
}
public function getNotas(Request $request)
{
    try {
        // Validar que se reciba un arreglo de IDs de estudiantes
        $validatedData = $request->validate([
            'estudiantes_ids' => 'required|array|min:1',
            'estudiantes_ids.*' => 'integer|exists:estudiantes,estudiante_id',
        ]);

        // Recuperar las notas de los estudiantes proporcionados, incluyendo materia_id, materia_nombre, bimestre y tipo
        $notas = Nota::whereIn('estudiante_id', $validatedData['estudiantes_ids'])
            ->join('materias', 'notas.materia_id', '=', 'materias.materia_id') // Join para obtener la materia
            ->get([
                'notas.estudiante_id', // ID del estudiante
                'notas.nota',          // Nota
                'notas.materia_id',    // materia_id
                'materias.nombre as materia_nombre', // Nombre de la materia
                'notas.bimestre',      // Bimestre
                'notas.tipo'           // Tipo (Tarea o Examen)
            ]); 

        if ($notas->isEmpty()) {
            return response()->json(['message' => 'No se encontraron notas relacionadas.'], 404);
        }

        return response()->json($notas, 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Error de validación.',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Ocurrió un error al obtener las notas.',
            'error' => $e->getMessage(),
        ], 500);
    }
}











    // Mostrar la vista HTML
    public function index()
    {
        try {
            $notas = Nota::all();
            return view('notas', compact('notas'));
        } catch (\Exception $e) {
            Log::error('Error al cargar la vista de notas: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al cargar la vista de notas'], 500);
        }
    }

    // Crear una nueva nota
    public function store(Request $request)
{
    // Validar los datos recibidos
    $validator = Validator::make($request->all(), [
        'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
        'curso_id' => 'required|exists:cursos,curso_id',  // El curso debe existir y ser válido
        'materia_id' => 'required|exists:materias,materia_id',
        'maestro_id' => 'required|exists:usuarios,user_id',
        'nota' => 'required|numeric|min:0|max:10',
        'fecha' => 'required|date',
        'observaciones' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        Log::warning('Error de validación al crear nota: ', $validator->errors()->toArray());
        return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 422);
    }

    $validatedData = $validator->validated();

    // Log para confirmar que el curso se asigna correctamente al estudiante
    Log::info('Datos validados en el controlador:', $validatedData);

    try {
        $nota = Nota::create($validatedData);  // Crea la nota con datos validados
        Log::info('Nota creada correctamente:', $nota->toArray());
        return response()->json(['status' => 'success', 'nota' => $nota], 201);
    } catch (\Exception $e) {
        Log::error('Error al crear nota: ' . $e->getMessage());
        return response()->json(['message' => 'Error interno al crear la nota'], 500);
    }
}


    // Obtener una nota por ID
    public function show($id)
    {
        try {
            $nota = Nota::find($id);
            if (!$nota) {
                return response()->json(['message' => 'Nota no encontrada'], 404);
            }
            return response()->json($nota);
        } catch (\Exception $e) {
            Log::error('Error al obtener la nota: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener la nota'], 500);
        }
    }

    // Actualizar una nota
    public function update(Request $request, $id)
    {
        try {
            $nota = Nota::find($id);
            if (!$nota) {
                return response()->json(['message' => 'Nota no encontrada'], 404);
            }

            $validator = Validator::make($request->all(), [
                'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
                'curso_id' => 'required|exists:cursos,curso_id',
                'materia_id' => 'required|exists:materias,materia_id',
                'maestro_id' => 'required|exists:usuarios,user_id',
                'nota' => 'required|numeric|min:0|max:10',
                'fecha' => 'required|date',
                'observaciones' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                Log::warning('Error de validación al actualizar nota: ', $validator->errors()->toArray());
                return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 422);
            }

            $validatedData = $validator->validated();
            $nota->update($validatedData);

            Log::info('Nota actualizada correctamente:', $nota->toArray());
            return response()->json($nota);
        } catch (\Exception $e) {
            Log::error('Error al actualizar nota: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al actualizar la nota'], 500);
        }
    }

    // Eliminar una nota
    public function destroy($id)
    {
        try {
            $nota = Nota::find($id);
            if (!$nota) {
                return response()->json(['message' => 'Nota no encontrada'], 404);
            }

            $nota->delete();
            Log::info('Nota eliminada correctamente:', ['nota_id' => $id]);
            return response()->json(['message' => 'Nota eliminada']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar nota: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al eliminar la nota'], 500);
        }
    }
}
