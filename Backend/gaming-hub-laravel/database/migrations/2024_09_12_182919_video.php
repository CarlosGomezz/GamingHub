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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->binary('video_data');
            $table->unsignedBigInteger('creator');
            $table->string('title');
            $table->string('description')->nullable();
            $table->unsignedBigInteger('game');
            $table->date('date');
            $table->string('video_path');
            $table->string('likes')->nullable();
            $table->string('dislikes')->nullable();
            $table->timestamps();

            $table->foreign('creator')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
