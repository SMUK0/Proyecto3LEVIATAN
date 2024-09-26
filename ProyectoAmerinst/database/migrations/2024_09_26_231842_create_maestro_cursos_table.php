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
        /* Schema::create('maestro_cursos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        }); */
        Schema::create('maestro_curso', function (Blueprint $table) {
            $table->foreignId('maestro_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('curso_id')->constrained('cursos')->onDelete('cascade');
            $table->primary(['maestro_id', 'curso_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maestro_cursos');
    }
};
