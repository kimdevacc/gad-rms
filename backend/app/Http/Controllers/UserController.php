<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Barangay;

class UserController extends Controller
{
    public function users(Request $request)
    {
        $currentUser = $request->user();

        $users = User::where('id', '!=', $currentUser->id)->get();
        foreach($users as $user) {
            $brgy = Barangay::findOrFail($user['barangay']);
            $user['barangay'] = $brgy ? $brgy->name : '' ;
        }
        
        return UserResource::collection($users);
    }

    public function get_user(Request $request, $id)
    {
        return new UserResource(User::findOrFail($id) ?? null);
    }

    public function store(Request $request)  {
        $request['password'] = Hash::make($request['password']);
        return new UserResource(User::create($request->all()));
    }

    public function update(Request $request)
    {
        $user = User::findOrFail($request->id);

        $updates = [];

        if ($request->has('email') && $request->email !== $user->email) {
            $updates['email'] = $request->email;
        }

        if ($request->has('first_name') && $request->first_name !== $user->first_name) {
            $updates['first_name'] = $request->first_name;
        }

        if ($request->has('last_name') && $request->last_name !== $user->last_name) {
            $updates['last_name'] = $request->last_name;
        }

        if ($request->has('contact_number') && $request->contact_number !== $user->contact_number) {
            $updates['contact_number'] = $request->contact_number;
        }

        if ($request->has('city') && $request->city !== $user->city) {
            $updates['city'] = $request->city;
        }

        if ($request->has('barangay') && $request->barangay !== $user->barangay) {
            $updates['barangay'] = $request->barangay;
        }

        if ($request->has('address_line_1') && $request->address_line_1 !== $user->address_line_1) {
            $updates['address_line_1'] = $request->address_line_1;
        }

        // Hash and update password if provided and modified
        if ($request->has('password')) {
            $newPassword = $request->password;
            if ($newPassword !== $user->password) {
                $updates['password'] = Hash::make($newPassword);
            }
        }

        // Check if role is modified
        if ($request->has('role') && $request->role !== $user->role) {
            $updates['role'] = $request->role;
        }

        // If there are updates, proceed with updating the user
        if (!empty($updates)) {
            $user->update($updates);
        }

        return new UserResource($user);
    }

    public function destroy(Request $request)
    {
        $user = User::findOrFail($request->id);
        return $user->delete();
    }
}
