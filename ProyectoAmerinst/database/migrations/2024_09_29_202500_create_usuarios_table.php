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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('email', 100)->unique();
            $table->string('password_hash', 255);
            $table->unsignedBigInteger('rol_id');  // La clave foránea debe coincidir en tipo
            $table->foreign('rol_id')->references('rol_id')->on('roles')->onDelete('cascade');
            $table->timestamp('fecha_creacion')->useCurrent();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
