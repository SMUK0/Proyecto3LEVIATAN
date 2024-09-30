<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    // Obtener todas las materias
    public function apiIndex()
    {
        $materias = Materia::all();
        return response()->json($materias, 200);
    }

    // Método para devolver la vista HTML
    public function index()
    {
        $materias = Materia::all();
        return view('materias', compact('materias'));
    }

    // Crear una nueva materia
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:100|unique:materias'
        ]);

        try {
            $materia = Materia::create($validatedData);
            return response()->json($materia, 201);
        } catch (\Exception $e) {
            Log::error('Error al crear materia: ' . $e->getMessage());
            return response()->json(['message' => 'Error al crear materia'], 500);
        }
    }

    // Obtener una materia por ID
    public function show($id)
    {
        $materia = Materia::find($id);
        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }
        return response()->json($materia);
    }

    // Actualizar una materia
    public function update(Request $request, $id)
    {
        $materia = Materia::find($id);
        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }

        $validatedData = $request->validate([
            'nombre' => 'required|string|max:100|unique:materias,nombre,' . $id . ',materia_id'
        ]);

        $materia->update($validatedData);
        return response()->json($materia);
    }

    // Eliminar una materia
    public function destroy($id)
    {
        $materia = Materia::find($id);
        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }

        $materia->delete();
        return response()->json(['message' => 'Materia eliminada']);
    }
}
