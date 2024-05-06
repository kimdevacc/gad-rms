<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ViolenceAgainstWomenResource;
use App\Models\ViolenceAgainstWomen;

class ViolenceAgainstWomenController extends Controller
{
    public function vaws(Request $request)
    {
        $currentUser = $request->user();

        if($currentUser->role === 'super admin') {
            $vaws = ViolenceAgainstWomen::all();
        } else {
            $vaws = ViolenceAgainstWomen::where('barangay', '=', $currentUser->barangay)->get();
        }

        return ViolenceAgainstWomenResource::collection($vaws);
    }

    public function store(Request $request)  {
        $request['number_vaw'] = $request->get('physical_abuse') + $request->get('psychological_abuse') + $request->get('economic_abuse') + $request->get('sexual_abuse');
        return new ViolenceAgainstWomenResource(ViolenceAgainstWomen::create($request->all()));
    }

    public function update(Request $request)
    {
        $vaws = ViolenceAgainstWomen::findOrFail($request->id);

        $fields = [
            'physical_abuse',
            'sexual_abuse',
            'psychological_abuse',
            'economic_abuse',
            'issued_bpo',
            'referred_lowdo',
            'referred_pnp',
            'referred_court',
            'referred_medical',
            'referred_nbi',
            'number_vaw',
            'month',
            'barangay',
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

        return new ViolenceAgainstWomenResource($vaws);
    }

    public function _update(Request $request)
    {
        $vaws = ViolenceAgainstWomen::findOrFail($request->id);

        $updates = [];

        if ($request->has('physical_abuse')) {
            $updates['physical_abuse'] = $request->physical_abuse;
        }

        if ($request->has('sexual_abuse')) {
            $updates['sexual_abuse'] = $request->sexual_abuse;
        }

        if ($request->has('psychological_abuse')) {
            $updates['psychological_abuse'] = $request->psychological_abuse;
        }

        if ($request->has('economic_abuse')) {
            $updates['economic_abuse'] = $request->economic_abuse;
        }

        if ($request->has('issued_bpo')) {
            $updates['issued_bpo'] = $request->issued_bpo;
        }

        if ($request->has('referred_lowdo')) {
            $updates['referred_lowdo'] = $request->referred_lowdo;
        }

        if ($request->has('referred_court')) {
            $updates['referred_court'] = $request->referred_court;
        }

        if ($request->has('referred_pnp')) {
            $updates['referred_pnp'] = $request->referred_pnp;
        }
        if ($request->has('referred_court')) {
            $updates['referred_court'] = $request->referred_court;
        }

        if ($request->has('referred_nbi')) {
            $updates['referred_nbi'] = $request->referred_nbi;
        }

        if ($request->has('number_vaw')) {
            $updates['number_vaw'] = $request->number_vaw;
        }

        if ($request->has('trainings')) {
            $updates['trainings'] = $request->trainings;
        }
        if ($request->has('counseling')) {
            $updates['counseling'] = $request->counseling;
        }
        if ($request->has('iec')) {
            $updates['iec'] = $request->iec;
        }
        if ($request->has('fund_allocation')) {
            $updates['fund_allocation'] = $request->fund_allocation;
        }
        if ($request->has('remarks')) {
            $updates['remarks'] = $request->remarks;
        }

        $total = $request->get('physical_abuse') + $request->get('psychological_abuse') + $request->get('economic_abuse') + $request->get('sexual_abuse');
        $updates['number_vaw'] = $total;

        if (!empty($updates)) {
            $vaws->update($updates);
        }

        return new ViolenceAgainstWomenResource($vaws);
    }

    public function destroy(Request $request)
    {
        $user = ViolenceAgainstWomen::findOrFail($request->id);
        return $user->delete();
    }
}
