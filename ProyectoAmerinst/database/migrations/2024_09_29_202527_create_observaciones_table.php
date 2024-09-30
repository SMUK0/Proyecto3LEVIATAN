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
        Schema::create('observaciones', function (Blueprint $table) {
            $table->id('observacion_id');
            $table->unsignedBigInteger('estudiante_id');  // Clave foránea de estudiantes
            $table->unsignedBigInteger('curso_id');       // Clave foránea de cursos
            $table->unsignedBigInteger('maestro_id'); 
        
            $table->foreign('estudiante_id')->references('estudiante_id')->on('estudiantes')->onDelete('cascade');
    $table->foreign('curso_id')->references('curso_id')->on('cursos')->onDelete('cascade');
    $table->foreign('maestro_id')->references('user_id')->on('usuarios')->onDelete('cascade');
            $table->date('fecha');
            $table->text('descripcion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('observaciones');
    }
};
