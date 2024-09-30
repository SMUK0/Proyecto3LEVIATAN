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
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id('asistencia_id');
            $table->unsignedBigInteger('estudiante_id');  // Debe ser unsignedBigInteger
            $table->unsignedBigInteger('curso_id');

            $table->foreign('estudiante_id')->references('estudiante_id')->on('estudiantes')->onDelete('cascade');
            $table->foreign('curso_id')->references('curso_id')->on('cursos')->onDelete('cascade');
            $table->date('fecha');
            $table->string('estado', 20); // Presente, Ausente, Tarde
            $table->text('observaciones')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
