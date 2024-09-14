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
        Schema::create('video', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('content_creator_id');
            $table->string('title');
            $table->string('description');
            $table->date('date');
            // $table->string('comments');
            $table->string('likes');
            $table->string('dislikes');

            $table->foreign('content_creator_id')->references('id')->on('content_creator');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video');
    }
};
