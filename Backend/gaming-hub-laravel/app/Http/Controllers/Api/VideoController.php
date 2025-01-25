<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Importar la clase Log

use App\Models\Video;

class VideoController extends Controller
{
    public function uploadVideo(Request $request)
    {
        try {
            // Validación de los datos de entrada
            $validatedData = $request->validate([
                'video_data' => 'required|file|mimes:mp4,avi,mkv,mov,flv|max:102400',
                'content_creator_id' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'date' => 'required|date|date_format:Y-m-d',
            ]);

            // Subida del archivo de video
            if ($request->hasFile('video_data')) {
                $videoFile = $request->file('video_data');
                // $videoFileName = time() . '.' . $videoFile->getClientOriginalExtension();
                $videoFileName = $videoFile->getClientOriginalName();

                // Guarda el archivo en el almacenamiento público
                // $path = $videoFile->storeAs('videos', $videoFileName, 'public');
                $path = $videoFile->public_path();
                // $path = public_path().'/uploads/';

                // Crea un nuevo registro del video
                $video = new Video();
                $video->content_creator_id = $validatedData['content_creator_id'];
                $video->title = $validatedData['title'];
                $video->description = $validatedData['description'] ?? null;
                $video->date = $validatedData['date'];
                $video->video_data = $path; // Ruta del archivo en la base de datos
                $video->save();

                return response()->json([
                    'message' => 'Video uploaded successfully.',
                    'status' => 200,
                    'isUploaded' => true,
                    'data' => $video, // Retorna los detalles del video si es necesario
                ], 200);
            }else{
                return response()->json([
                    'message' => 'No se ha recibido ningun archivo.',
                    'status' => 400,
                    'isUploaded' => false,
                ], 400);
            }

            // Si no se encontró un archivo en la solicitud
            return response()->json([
                'message' => 'No video file uploaded.',
                'status' => 400,
                'isUploaded' => false,
            ], 400);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Registro y respuesta para errores de validación
            Log::error('Validation error uploading video: ' . $e->getMessage(), [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Validation error.',
                'errors' => $e->errors(),
                'status' => 422,
            ], 422);
        } catch (\Exception $e) {
            // Registro y respuesta para errores generales
            Log::error('Error uploading video: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'message' => 'An error occurred while uploading the video.',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }
}
