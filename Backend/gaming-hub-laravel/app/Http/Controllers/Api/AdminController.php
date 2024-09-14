<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;


class AdminController extends Controller
{
    public function signinAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'surname' => 'required',
            'secondSurname' => 'required',
            'username' => 'required',
            'email' => 'required|email|unique:admins',
            'password' => 'required',
        ]);

        $admin = new Admin;
        $admin->name = $request->name;
        $admin->surname = $request->surname;
        $admin->secondSurname = $request->secondSurname;
        $admin->username = $request->assignedLocation;
        $admin->email = $request->email;
        $admin->password = Hash::make($request->password);

        try {
            if ($admin->save()) {
                $message = "Registered correctly.";
                return response()->json([$message, 200, 'isRegistered' => true]);
            }
        } catch (QueryException $ex) {
            $message = "Couldn't register.";
            return response()->json([$message, 500, 'isRegistered' => false]);
        }
    }

    public function loginAdmin(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Buscar el usuario por su correo electrónico
        $user = Admin::where('email', $credentials['email'])->first();

        // Verificar si el usuario existe y si la contraseña coincide
        if ($user && Hash::check($credentials['password'], $user->password)) {
            // Autenticación exitosa, crear token de acceso personal
            $token = $user->createToken('token')->plainTextToken;
            return response([$token, $user, 'isLoggedIn' => true]);
        } else {
            // Autenticación fallida
            return response(['isLoggedIn' => false]);
        }
    }
}
