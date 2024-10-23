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
            $notas = Nota::all();
            return response()->json($notas, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener notas: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener las notas'], 500);
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
            'curso_id' => 'required|exists:cursos,curso_id',
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
        Log::info('Datos validados en el controlador:', $validatedData);

        try {
            $nota = Nota::create($validatedData);
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
