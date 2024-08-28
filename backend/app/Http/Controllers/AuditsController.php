<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\AuditsResource;
use App\Models\Audits;

class AuditsController extends Controller
{
    public function audits(Request $request)
    {
        $audits = Audits::all();
        
        return AuditsResource::collection($audits);
    }
}
