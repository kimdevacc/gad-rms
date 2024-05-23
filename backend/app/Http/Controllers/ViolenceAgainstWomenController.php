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
        $data = $this->build_data($request);
        
        $violenceAgainstWomen = ViolenceAgainstWomen::create($data);

        return new ViolenceAgainstWomenResource($violenceAgainstWomen);
    }
    
    public function update(Request $request)
    {
        $vaws = ViolenceAgainstWomen::findOrFail($request->id);

        $data = $this->build_data($request);

        $vaws->update($data);

        return new ViolenceAgainstWomenResource($vaws);
    }

    public function destroy(Request $request)
    {
        $user = ViolenceAgainstWomen::findOrFail($request->id);
        return $user->delete();
    }

    private function build_data($request) {
        $data = [
            'number_vaw' => $request->number_vaw ?? 0,
            'remarks' => $request->remarks ?? 'RECORD ONLY',
            'month' => $request->month,
            'barangay' => $request->barangay ?? 0,
        ];
        
        // Handling abuseRows
        foreach ($request->abuseRows as $row) {
            switch ($row['abuseType']) {
                case 'Physical Abuse':
                    $data['physical_abuse'] = $row['abuseValue'];
                    break;
                case 'Sexual Abuse':
                    $data['sexual_abuse'] = $row['abuseValue'];
                    break;
                case 'Psychological Abuse':
                    $data['psychological_abuse'] = $row['abuseValue'];
                    break;
                case 'Economic Abuse':
                    $data['economic_abuse'] = $row['abuseValue'];
                    break;
            }
        }
        
        // Handling actionRows
        foreach ($request->actionRows as $row) {
            switch ($row['action']) {
                case 'Issued BPO':
                    $data['issued_bpo'] = $row['actionValue'];
                    break;
                case 'Referred to LoWDO':
                    $data['referred_lowdo'] = $row['actionValue'];
                    break;
                case 'Referred to PNP':
                    $data['referred_pnp'] = $row['actionValue'];
                    break;
                case 'Referred to NBI':
                    $data['referred_nbi'] = $row['actionValue'];
                    break;
                case 'Referred to Court':
                    $data['referred_court'] = $row['actionValue'];
                    break;
                case 'Referred for Medical':
                    $data['referred_medical'] = $row['actionValue'];
                    break;
            }
        }
        
        // Handling programsRows
        foreach ($request->programsRows as $row) {
            switch ($row['program']) {
                case 'Trainings/Seminars':
                    $data['trainings'] = $row['programValue'];
                    break;
                case 'Counseling':
                    $data['counseling'] = $row['programValue'];
                    break;
                case 'IEC':
                    $data['iec'] = $row['programValue'];
                    break;
                case 'Fund Allocation':
                    $data['fund_allocation'] = $row['programValue'];
                    break;
            }
        }
        return $data;
    }
}
