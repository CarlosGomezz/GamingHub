<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;



// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::middleware('admin')->group(function () {
    // Rutas de administrador aquí
    Route::post('/signupAdmin', [AdminController::class, 'signupAdmin']);
    
});
Route::post('/loginAdmin', [AdminController::class, 'loginAdmin']);
// Route::get('loginAdmin', [ 'as' => 'loginAdmin', 'uses' => [AdminController::class, 'loginAdmin']]);

// ADMIN CONTROLLER
// Route::post('/signupAdmin', [AdminController::class, 'signupAdmin']);


// Route::post('/updateRequestStatus/{id}', [AdminController::class, 'updateRequestStatus']);





