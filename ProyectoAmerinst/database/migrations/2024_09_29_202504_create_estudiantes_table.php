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
        Schema::create('estudiantes', function (Blueprint $table) {
            $table->engine = 'InnoDB';  // Asegúrate de usar InnoDB
            $table->id('estudiante_id');
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->date('fecha_nacimiento');
            $table->unsignedBigInteger('curso_id');
            $table->foreign('curso_id')->references('curso_id')->on('cursos')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        #Schema::dropIfExists('estudiantes');
        Schema::table('estudiantes', function (Blueprint $table) {
            // Eliminar la clave foránea y el campo curso_id
            $table->dropForeign(['curso_id']);
            $table->dropColumn('curso_id');
        });
    }
};
