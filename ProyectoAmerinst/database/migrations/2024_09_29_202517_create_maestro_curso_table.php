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
        Schema::create('maestro_curso', function (Blueprint $table) {
    $table->unsignedBigInteger('maestro_id');  // La clave foránea debe coincidir en tipo con usuarios.user_id
    $table->unsignedBigInteger('curso_id');
    
    $table->foreign('maestro_id')->references('user_id')->on('usuarios')->onDelete('cascade');
    $table->foreign('curso_id')->references('curso_id')->on('cursos')->onDelete('cascade');

    $table->primary(['maestro_id', 'curso_id']);
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maestro_curso');
    }
};
