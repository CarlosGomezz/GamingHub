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
            try {
                Log::info('Archivos recibidos:', ['files' => $request->allFiles()]);

                // Validación de los datos de entrada
                $validatedData = $request->validate([
                    'video_data' => 'required|file|mimes:mp4,avi,mkv,mov,flv|max:102400',
                    'content_creator_id' => 'required|string|max:255',
                    'title' => 'required|string|max:255',
                    'description' => 'nullable|string|max:1000',
                    'date' => 'required|date|date_format:Y-m-d',
                ]);

                // Subida del archivo de video
                $videoFile = $request->file('video_data');
                $videoFileName = time() . '-' . $videoFile->getClientOriginalName();
                Log::info('Nombre del archivo', ['nombre' => $videoFileName]);

                // Almacena el archivo en el directorio public/videos/
                $videoPath = $videoFile->storeAs('videos', $videoFileName, 'public');

                // Crea un nuevo registro de video en la base de datos
                $video = new Video();
                $video->content_creator_id = $validatedData['content_creator_id'];
                $video->title = $validatedData['title'];
                $video->description = $validatedData['description'] ?? null;
                $video->date = $validatedData['date'];

                // Aquí se guarda la ruta relativa en la base de datos
                $video->video_data = 'storage/videos/' . $videoFileName;

                // Construye la URL pública del archivo
                $videoUrl = asset('storage/videos/' . $videoFileName); // Utiliza la función `asset()`, que se encarga de generar la URL correcta

                // Almacena la URL completa en la base de datos
                $video->video_path = $videoUrl;

                // Guarda el registro del video
                $video->save();

                return response()->json([
                    'message' => 'Video uploaded successfully.',
                    'status' => 200,
                    'isUploaded' => true,
                    'data' => $video,
                ], 200);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json([
                    'message' => 'Datos no válidos.',
                    'status' => 400,
                    'isUploaded' => false,
                    'errors' => $e->errors(),
                ], 400);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error al subir el video.',
                    'status' => 500,
                    'isUploaded' => false,
                    'error' => $e->getMessage(),
                ], 500);
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
