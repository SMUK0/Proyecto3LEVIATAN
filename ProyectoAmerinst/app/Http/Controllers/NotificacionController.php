<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificacionController extends Controller
{
   // Obtener todas las notificaciones
   public function apiIndex()
   {
       return response()->json(Notificacion::all(), 200);
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
           return response()->json($notificacion, 201);
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
       return response()->json($notificacion);
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
