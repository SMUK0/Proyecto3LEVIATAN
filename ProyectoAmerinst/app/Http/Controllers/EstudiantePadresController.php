<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EstudiantePadre;
use Illuminate\Support\Facades\Log;

class EstudiantePadresController extends Controller
{
    // Obtener todas las relaciones estudiante-padre (API)
    public function apiIndex()
    {
        $relaciones = EstudiantePadre::all();
        return response()->json($relaciones, 200);
    }

    // Mostrar la vista para la interfaz (Web)
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
            return response()->json($relacion, 201); // Retorna la relación creada en formato JSON
        } catch (\Exception $e) {
            Log::error('Error al crear relación estudiante-padre: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al crear relación estudiante-padre'], 500);
        }
    }

    // Actualizar una relación estudiante-padre
    // Método de actualización
    public function update(Request $request, $estudiante_id, $padre_id)
    {
        // Buscar la relación usando where() en lugar de find()
        $relacion = EstudiantePadre::where('estudiante_id', $estudiante_id)
                                    ->where('padre_id', $padre_id)
                                    ->first(); // Utilizamos first() para obtener el primer registro encontrado
    
        // Verificar si la relación existe
        if (!$relacion) {
            Log::error("No se encontró la relación Estudiante-Padre con los ID proporcionados.");
            return response()->json(['message' => 'Relación no encontrada o no válida'], 404);
        }
    
        // Validación de los datos
        $validatedData = $request->validate([
            'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
            'padre_id' => 'required|exists:usuarios,user_id',
        ]);
    
        try {
            // Actualizar la relación, ya que $relacion es un objeto Eloquent
            $relacion->update($validatedData);
    
            // Retornar el objeto actualizado
            return response()->json($relacion, 200);
        } catch (\Exception $e) {
            Log::error('Error al actualizar relación estudiante-padre: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al actualizar relación estudiante-padre'], 500);
        }
    }
    
    
    










    // Eliminar una relación estudiante-padre
    public function destroy($estudiante_id, $padre_id)
{
    // Buscar la relación usando las claves compuestas
    $relacion = EstudiantePadre::where('estudiante_id', $estudiante_id)
                            ->where('padre_id', $padre_id)
                            ->first();  // Usar first() para obtener un solo objeto, no un arreglo


    // Verificar si la relación existe
    if (!$relacion) {
        Log::error("No se encontró la relación Estudiante ID: $estudiante_id y Padre ID: $padre_id");
        return response()->json(['message' => 'Relación no encontrada'], 404);
    }

    // Verificar el tipo de la relación
    Log::info('Tipo de la relación:', ['type' => get_class($relacion)]); // Verifica el tipo de la relación
    Log::info('Propiedades de la relación:', ['relacion' => $relacion]);

    // Asegúrate de que el objeto Eloquent es válido
    if ($relacion instanceof EstudiantePadre) {
        Log::info("Eliminando relación Estudiante ID: {$relacion->estudiante_id} y Padre ID: {$relacion->padre_id}");
        try {
            $relacion->delete();  // Usar delete() sobre el objeto Eloquent
            Log::info("Relación eliminada");
            return response()->json(['message' => 'Relación eliminada exitosamente'], 200);
        } catch (\Exception $e) {
            Log::error("Error al eliminar relación: " . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar relación'], 500);
        }
    } else {
        Log::error('La relación no es un objeto válido');
        return response()->json(['message' => 'Relación no encontrada'], 404);
    }
    
}




    



    





}
