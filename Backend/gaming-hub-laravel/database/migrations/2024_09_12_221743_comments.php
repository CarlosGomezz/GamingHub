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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('video_id'); // Relación con la tabla video
            $table->string('author'); // Nombre del autor del comentario (puedes ajustar esto según tu estructura de usuarios)
            $table->text('comment'); // El contenido del comentario
            $table->timestamps(); // Guarda la fecha de creación y actualización
            $table->softDeletes(); // (Opcional) Para permitir eliminar comentarios sin borrarlos realmente
        
            // Foreign key constraint
            $table->foreign('video_id')->references('id')->on('videos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
        
    }
};
