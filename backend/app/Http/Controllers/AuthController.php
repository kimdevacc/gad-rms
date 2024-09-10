<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Barangay;
use App\Models\Audits;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('MyAppToken')->plainTextToken;
            
            Audits::create([
                'user_id' => $user->id,
                'auditable_type' => 'App\Models\User',
                'auditable_id' => $user->id,
                'event' => 'login',
                'new_values' => [
                    'transaction' => 'Logged In'
                ],
                'old_values' => []
            ]);

            return response()->json([
                'token' => $token,
                'role' => $user->role,
                'currentUser' => $user->id,
                'barangay' => $user->barangay
            ], 200);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout(Request $request)
    {
        $user = Auth::user();

        Audits::create([
            'user_id' => $user->id,
            'auditable_type' => 'App\Models\User',
            'auditable_id' => $user->id,
            'event' => 'logout',
            'new_values' => [
                'transaction' => 'Logged Out'
            ],
            'old_values' => []
        ]);

        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
