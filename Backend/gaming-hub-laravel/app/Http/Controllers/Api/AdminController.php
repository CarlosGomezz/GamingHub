<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;


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
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Buscar el usuario por su correo electrónico
        $admin = Admin::where('email', $credentials['email'])->first();

        // Verificar si el usuario existe y si la contraseña coincide
        if ($admin && Hash::check($credentials['password'], $admin->password)) {
            // Autenticación exitosa, crear token de acceso personal
            $token = $admin->createToken('token')->plainTextToken;
            return response([$token, $admin, 'isLoggedIn' => true]);
        } else {
            // Autenticación fallida
            return response(['isLoggedIn' => false]);
        }

            // return response('jajajaj');

    }
}
