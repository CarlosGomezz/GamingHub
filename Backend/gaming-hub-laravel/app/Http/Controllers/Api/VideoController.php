<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Importar la clase Log
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\Video;

class VideoController extends Controller
{
    public function uploadVideo(Request $request)
    {
        /**
         * Función para subir un vídeo
         */
        Log::info('Archivos recibidos:', ['files' => $request->allFiles()]);

        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'video_data' => 'required|file|mimes:mp4,avi,mkv,mov,flv|max:102400',
            'creator' => 'required|string|max:255',
            'game' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'date' => 'required|date|date_format:Y-m-d',
        ]);

        // Subida del archivo de video
        $videoFile = $request->file('video_data');
        $videoFileName = time() . '-' . $videoFile->getClientOriginalName();
        Log::info('Nombre del archivo', ['nombre' => $videoFileName]);

        // Usamos una transacción para evitar registros incorrectos en caso de fallo
        DB::beginTransaction();

        try {
            $videoPath = $videoFile->storeAs('videos', $videoFileName, 'public');
            $videoUrl = asset('storage/videos/' . $videoFileName);

            // Creación del modelo Video
            $video = new Video();
            $video->creator = $validatedData['creator'];
            $video->game = $validatedData['game'];
            $video->title = $validatedData['title'];
            $video->description = $validatedData['description'] ?? null;
            $video->date = $validatedData['date'];
            $video->video_data = 'storage/videos/' . $videoFileName;
            $video->video_path = $videoUrl;

            $video->save();

            DB::commit(); // Confirma la transacción

            return response()->json([
                'message' => 'Video uploaded successfully.',
                'status' => 200,
                'isUploaded' => true,
                'data' => $video,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack(); // Revierte la transacción si hay un error

            // Elimina el archivo subido si ocurre un error después de la subida
            if (Storage::disk('public')->exists('videos/' . $videoFileName)) {
                Storage::disk('public')->delete('videos/' . $videoFileName);
            }

            Log::error('Error subiendo video: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'message' => 'An error occurred while uploading the video.',
                'error' => $e->getMessage(),
                'status' => 500,
                'isUploaded' => false,
            ], 500);
        }
    }

    public function listVideos(Request $request){
        $videos = Video::all();

        return response()->json($videos, 200);
    }

    public function listVideosGame(Request $request) {
        // Buscar el video por ID
        $gameId = $request->gameId;
        $videos = Video::where('game', $gameId)->get();

        // Si no hay videos, devolver un error 404
        if ($videos->isEmpty()) {
            return response()->json([
                'message' => 'No uploaded videos'
            ], 404);
        }

        // Devolver el video en formato JSON
        return response()->json($videos, 200);
    }

    public function returnVideo(Request $request) {
        // Buscar el video por ID
        $videoId = $request->videoId;

        $video = Video::find($videoId);

        // Si no existe, devolver un error 404
        if (!$video) {
            return response()->json([
                'message' => 'Video not found'
            ], 404);
        }

        // Devolver el video en formato JSON
        return response()->json($video, 200);
    }


}
