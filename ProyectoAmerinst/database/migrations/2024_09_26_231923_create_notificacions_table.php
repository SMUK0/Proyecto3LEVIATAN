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
        /* Schema::create('notificacions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        }); */
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id(); // notificacion_id
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade'); // Padre
            $table->foreignId('estudiante_id')->constrained('estudiantes')->onDelete('cascade');
            $table->text('mensaje');
            $table->timestamp('fecha')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->boolean('leido')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificacions');
    }
};
