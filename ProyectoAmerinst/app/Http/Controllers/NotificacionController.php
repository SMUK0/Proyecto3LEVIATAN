<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Estudiante;

class NotificacionController extends Controller
{
   // Obtener todas las notificaciones
   public function apiIndex(Request $request)
{
    // Obtener el usuario_id de la consulta
    $usuarioId = $request->query('usuario_id');
    
    // Filtrar las notificaciones por usuario_id
    $notificaciones = Notificacion::with(['usuario', 'estudiante'])
        ->where('usuario_id', $usuarioId)
        ->get()
        ->map(function ($notificacion) {
            return [
                'notificacion_id' => $notificacion->notificacion_id,
                'usuario_id' => $notificacion->usuario_id,
                'usuario_nombre' => $notificacion->usuario ? $notificacion->usuario->nombre : 'Desconocido',
                'estudiante_id' => $notificacion->estudiante_id,
                'estudiante_nombre' => $notificacion->estudiante ? $notificacion->estudiante->nombre : 'Desconocido',
                'mensaje' => $notificacion->mensaje,
                'leido' => $notificacion->leido,
                'fecha' => $notificacion->created_at->format('Y-m-d')
            ];
        });

    return response()->json($notificaciones, 200);
}



   // Mostrar la vista HTML
   public function index()
   {
       return view('notificaciones');
   }

   // Crear una nueva notificación
   public function store(Request $request)
{
    $validatedData = $request->validate([
        'usuario_id' => 'required|exists:usuarios,user_id',
        'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
        'mensaje' => 'required|string',
        'leido' => 'boolean'
    ]);

    try {
        $notificacion = Notificacion::create($validatedData);
        $notificacion->load('usuario', 'estudiante'); // Cargar relaciones
        $response = [
            'notificacion_id' => $notificacion->notificacion_id,
            'usuario_id' => $notificacion->usuario_id,
            'usuario_nombre' => $notificacion->usuario ? $notificacion->usuario->nombre : 'Desconocido',
            'estudiante_id' => $notificacion->estudiante_id,
            'estudiante_nombre' => $notificacion->estudiante ? $notificacion->estudiante->nombre : 'Desconocido',
            'mensaje' => $notificacion->mensaje,
            'leido' => $notificacion->leido,
            'fecha' => $notificacion->created_at->format('Y-m-d')
        ];

        return response()->json($response, 201);
    } catch (\Exception $e) {
        Log::error('Error al crear notificación: ' . $e->getMessage());
        return response()->json(['message' => 'Error interno al crear la notificación'], 500);
    }
}

   // Obtener una notificación por ID
   public function show($id)
   {
       $notificacion = Notificacion::find($id);
       if (!$notificacion) {
           return response()->json(['message' => 'Notificación no encontrada'], 404);
       }
       return response()->json($notificacion);
   }

   // Actualizar una notificación
   public function update(Request $request, $id)
{
    $notificacion = Notificacion::find($id);
    if (!$notificacion) {
        return response()->json(['message' => 'Notificación no encontrada'], 404);
    }

    $validatedData = $request->validate([
        'usuario_id' => 'required|exists:usuarios,user_id',
        'estudiante_id' => 'required|exists:estudiantes,estudiante_id',
        'mensaje' => 'required|string',
        'leido' => 'boolean'
    ]);

    $notificacion->update($validatedData);
    $notificacion->load('usuario', 'estudiante'); // Cargar relaciones después de la actualización
    $response = [
        'notificacion_id' => $notificacion->notificacion_id,
        'usuario_id' => $notificacion->usuario_id,
        'usuario_nombre' => $notificacion->usuario ? $notificacion->usuario->nombre : 'Desconocido',
        'estudiante_id' => $notificacion->estudiante_id,
        'estudiante_nombre' => $notificacion->estudiante ? $notificacion->estudiante->nombre : 'Desconocido',
        'mensaje' => $notificacion->mensaje,
        'leido' => $notificacion->leido,
        'fecha' => $notificacion->updated_at->format('Y-m-d')
    ];

    return response()->json($response);
}


public function estudiantesPorMaestro(Request $request)
{
    $maestro_id = $request->input('maestro_id');
    
    Log::info("Recibiendo solicitud de estudiantes filtrados para maestro_id: " . $maestro_id);

    // Verifica que el maestro_id haya sido recibido correctamente
    if (!$maestro_id) {
        Log::error("maestro_id no proporcionado");
        return response()->json(['message' => 'maestro_id no proporcionado'], 400);
    }

    // Consulta estudiantes en cursos relacionados con el maestro_id
    $estudiantes = Estudiante::whereHas('curso', function ($query) use ($maestro_id) {
        $query->whereHas('maestros', function ($query) use ($maestro_id) {
            $query->where('maestro_id', $maestro_id);
        });
    })->get();

    // Verificar el resultado de la consulta
    if ($estudiantes->isEmpty()) {
        Log::info("No se encontraron estudiantes para maestro_id: " . $maestro_id);
    } else {
        Log::info("Estudiantes encontrados: ", $estudiantes->toArray());
    }

    return response()->json($estudiantes);
}






   // Eliminar una notificación
   public function destroy($id)
   {
       $notificacion = Notificacion::find($id);
       if (!$notificacion) {
           return response()->json(['message' => 'Notificación no encontrada'], 404);
       }

       $notificacion->delete();
       return response()->json(['message' => 'Notificación eliminada']);
   }
}
