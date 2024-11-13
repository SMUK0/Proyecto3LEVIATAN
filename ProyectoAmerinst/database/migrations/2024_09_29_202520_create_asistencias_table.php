<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAsistenciasTable extends Migration
{
    public function up()
    {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id('asistencia_id');
            $table->unsignedBigInteger('estudiante_id');
            $table->unsignedBigInteger('curso_id');
            $table->string('estado', 1); // P = Presente, A = Ausente, T = Tarde
            $table->date('fecha')->default(DB::raw('CURRENT_DATE'))->change(); // Establece la fecha actual como valor predeterminado
            $table->timestamps();

            $table->foreign('estudiante_id')->references('estudiante_id')->on('estudiantes');
            $table->foreign('curso_id')->references('curso_id')->on('cursos');
        });
    }

    public function down()
    {
        Schema::dropIfExists('asistencias');
    }
}

