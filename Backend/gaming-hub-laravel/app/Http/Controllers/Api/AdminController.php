<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;


class AdminController extends Controller
{
    public function signupAdmin(Request $request)
    {
        // Validación de los campos
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'secondSurname' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Verificar si el username ya existe
        $usernameExists = Admin::where('username', $validatedData['username'])->exists();
        if ($usernameExists) {
            return response()->json([
                'message' => 'Username already exists.',
                'status' => 400,
                'isRegistered' => false
            ], 400);
        }

        // Verificar si el email ya existe
        $emailExists = Admin::where('email', $validatedData['email'])->exists();
        if ($emailExists) {
            return response()->json([
                'message' => 'Email already exists.',
                'status' => 400,
                'isRegistered' => false
            ], 400);
        }

        // Creación del nuevo administrador
        $admin = new Admin;
        $admin->name = $validatedData['name'];
        $admin->surname = $validatedData['surname'];
        $admin->secondSurname = $validatedData['secondSurname'];
        $admin->username = $validatedData['username'];
        $admin->email = $validatedData['email'];
        $admin->password = Hash::make($validatedData['password']); // Hashear la contraseña

        $admin->save();

        return response()->json([
            'message' => 'Registered correctly.',
            'status' => 200,
            'isRegistered' => true
        ], 200);
    }



    public function loginAdmin(Request $request)
    {
        // Validar las credenciales
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);
    
        // Intentar autenticar al administrador
        if (Auth::guard('admin')->attempt($credentials)) {
            // Autenticación exitosa, generar token de acceso personal
            $admin = Auth::guard('admin')->user();
            $token = $admin->createToken('admin-token')->plainTextToken;
    
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'isLoggedIn' => true
            ], 200);
        } else {
            // Autenticación fallida
            return response()->json([
                'message' => 'Login failed, invalid credentials',
                'isLoggedIn' => false
            ], 401);
        }
    }
    
}
