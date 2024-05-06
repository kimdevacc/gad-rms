<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ViolenceAgainstChildrenResource;
use App\Models\ViolenceAgainstChildren;


class ViolenceAgainstChildrenController extends Controller
{
    public function vacs(Request $request)
    {
        $currentUser = $request->user();

        if($currentUser->role === 'super admin') {
            $vacs = ViolenceAgainstChildren::all();
        } else {
            $vacs = ViolenceAgainstChildren::where('barangay', '=', $currentUser->barangay)->get();
        }
        return ViolenceAgainstChildrenResource::collection($vacs);
    }

    public function store(Request $request)  {
        return new ViolenceAgainstChildrenResource(ViolenceAgainstChildren::create($request->all()));
    }

    public function update(Request $request)
    {
        $vaws = ViolenceAgainstChildren::findOrFail($request->id);

        $fields = [
            'month',
            'number_vac',
            'male',
            'female',
            'range_one',
            'range_two',
            'range_three',
            'range_four',
            'range_five',
            'physical_abuse',
            'sexual_abuse',
            'psychological_abuse',
            'neglect',
            'others',
            'immediate_family',
            'other_close_relative',
            'acquaintance',
            'stranger',
            'local_official',
            'law_enforcer',
            'other_guardians',
            'referred_pnp',
            'referred_nbi',
            'referred_medical',
            'referred_legal_assist',
            'referred_others',
            'trainings',
            'counseling',
            'iec',
            'fund_allocation',
            'remarks'
        ];

        foreach ($fields as $field) {
            if ($request->has($field) && $vaws->$field != $request->$field) {
                $vaws->$field = $request->$field;
            }
        }

        $vaws->save();

        return new ViolenceAgainstChildrenResource($vaws);
    }


    public function destroy(Request $request)
    {
        $user = ViolenceAgainstChildren::findOrFail($request->id);
        return $user->delete();
    }
}
