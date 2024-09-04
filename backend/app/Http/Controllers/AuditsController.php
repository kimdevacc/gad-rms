<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\AuditsResource;
use App\Models\Audits;

class AuditsController extends Controller
{
    public function audits(Request $request)
    {
        $currentUser = $request->user();

        if($currentUser->role === 'super admin') {
            $audits = Audits::all();
        } else {
            $audits = Audits::where('user_id', '=', $currentUser->id)->get();
        }
        return AuditsResource::collection($audits);
    }
}
