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
        /* Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        }); */
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id(); // user_id
            $table->string('nombre');
            $table->string('apellido');
            $table->string('email')->unique();
            $table->string('password_hash'); // Hashed password
            $table->foreignId('rol_id')->constrained('roles')->onDelete('restrict');
            $table->timestamps();
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
