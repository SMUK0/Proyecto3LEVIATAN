<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id('notificacion_id');
            $table->unsignedBigInteger('usuario_id');     // Clave foránea de usuarios
    $table->unsignedBigInteger('estudiante_id');

            $table->foreign('usuario_id')->references('user_id')->on('usuarios')->onDelete('cascade');
    $table->foreign('estudiante_id')->references('estudiante_id')->on('estudiantes')->onDelete('cascade');
            $table->text('mensaje');
            $table->timestamp('fecha')->useCurrent();
            $table->boolean('leido')->default(false); // Si el padre leyó la notificación
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
