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
        Schema::create('notas', function (Blueprint $table) {
            $table->id('nota_id');
            $table->unsignedBigInteger('estudiante_id');  // Debe ser unsignedBigInteger
            $table->unsignedBigInteger('curso_id');
            $table->unsignedBigInteger('materia_id');
            $table->unsignedBigInteger('maestro_id');
        

            $table->foreign('estudiante_id')->references('estudiante_id')->on('estudiantes')->onDelete('cascade');
            $table->foreign('curso_id')->references('curso_id')->on('cursos')->onDelete('cascade');
            $table->foreign('materia_id')->references('materia_id')->on('materias')->onDelete('cascade');
            $table->foreign('maestro_id')->references('user_id')->on('usuarios')->onDelete('cascade');
            $table->decimal('nota', 5, 2)->check('nota >= 0 AND nota <= 10');
            $table->date('fecha');
            $table->text('observaciones')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notas');
    }
};
