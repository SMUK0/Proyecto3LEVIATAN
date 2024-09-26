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
        /* Schema::create('estudiante_padres', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        }); */
        Schema::create('estudiante_padre', function (Blueprint $table) {
            $table->foreignId('estudiante_id')->constrained('estudiantes')->onDelete('cascade');
            $table->foreignId('padre_id')->constrained('usuarios')->onDelete('cascade');
            $table->primary(['estudiante_id', 'padre_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiante_padres');
    }
};
