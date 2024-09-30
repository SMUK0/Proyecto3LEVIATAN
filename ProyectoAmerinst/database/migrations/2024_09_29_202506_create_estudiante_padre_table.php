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
            Schema::create('estudiante_padre', function (Blueprint $table) {
            $table->unsignedBigInteger('estudiante_id');
            $table->unsignedBigInteger('padre_id');
            
            $table->foreign('estudiante_id')->references('estudiante_id')->on('estudiantes')->onDelete('cascade');
            $table->foreign('padre_id')->references('user_id')->on('usuarios')->onDelete('cascade');
        
            $table->primary(['estudiante_id', 'padre_id']);  // Combinación de PK
        });
    }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiante_padre');
    }
};
