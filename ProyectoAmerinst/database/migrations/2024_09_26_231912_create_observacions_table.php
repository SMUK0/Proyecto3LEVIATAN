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
        /* Schema::create('observacions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        }); */
        Schema::create('observaciones', function (Blueprint $table) {
            $table->id(); // observacion_id
            $table->foreignId('estudiante_id')->constrained('estudiantes')->onDelete('cascade');
            $table->foreignId('curso_id')->constrained('cursos')->onDelete('cascade');
            $table->foreignId('maestro_id')->constrained('usuarios')->onDelete('cascade');
            $table->date('fecha');
            $table->text('descripcion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('observacions');
    }
};
