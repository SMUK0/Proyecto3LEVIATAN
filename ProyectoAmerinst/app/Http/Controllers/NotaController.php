<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotaController extends Controller
{
     // Obtener todas las notas
     public function apiIndex()
     {
         return response()->json(Nota::all(), 200);
     }
 
     // Mostrar la vista HTML
     public function index()
     {
         $notas = Nota::all();
         return view('notas', compact('notas'));
     }
 
     // Crear una nueva nota
     public function store(Request $request)
     {
         $validatedData = $request->validate([
             'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
             'curso_id' => 'required|exists:cursos,curso_id',
             'materia_id' => 'required|exists:materias,materia_id',
             'maestro_id' => 'required|exists:usuarios,user_id',
             'nota' => 'required|numeric|min:0|max:10',
             'fecha' => 'required|date',
             'observaciones' => 'nullable|string'
         ]);
 
         try {
             $nota = Nota::create($validatedData);
             return response()->json($nota, 201);
         } catch (\Exception $e) {
             Log::error('Error al crear nota: ' . $e->getMessage());
             return response()->json(['message' => 'Error interno al crear la nota'], 500);
         }
     }
 
     // Obtener una nota por ID
     public function show($id)
     {
         $nota = Nota::find($id);
         if (!$nota) {
             return response()->json(['message' => 'Nota no encontrada'], 404);
         }
         return response()->json($nota);
     }
 
     // Actualizar una nota
     public function update(Request $request, $id)
     {
         $nota = Nota::find($id);
         if (!$nota) {
             return response()->json(['message' => 'Nota no encontrada'], 404);
         }
 
         $validatedData = $request->validate([
             'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
             'curso_id' => 'required|exists:cursos,curso_id',
             'materia_id' => 'required|exists:materias,materia_id',
             'maestro_id' => 'required|exists:usuarios,user_id',
             'nota' => 'required|numeric|min:0|max:10',
             'fecha' => 'required|date',
             'observaciones' => 'nullable|string'
         ]);
 
         $nota->update($validatedData);
         return response()->json($nota);
     }
 
     // Eliminar una nota
     public function destroy($id)
     {
         $nota = Nota::find($id);
         if (!$nota) {
             return response()->json(['message' => 'Nota no encontrada'], 404);
         }
 
         $nota->delete();
         return response()->json(['message' => 'Nota eliminada']);
     }
}
