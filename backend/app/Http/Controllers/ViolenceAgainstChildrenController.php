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
        $data = $this->build_data($request);
        
        $violenceAgainstChildren = ViolenceAgainstChildren::create($data);

        return new ViolenceAgainstChildrenResource($violenceAgainstChildren);
        // return new ViolenceAgainstChildrenResource(ViolenceAgainstChildren::create($request->all()));
    }

    public function update(Request $request)
    {
        $vaws = ViolenceAgainstChildren::findOrFail($request->id);

        $data = $this->build_data($request);

        $vaws->update($data);

        return new ViolenceAgainstChildrenResource($vaws);
    }


    public function destroy(Request $request)
    {
        $user = ViolenceAgainstChildren::findOrFail($request->id);
        return $user->delete();
    }

    private function build_data($request) {
        $data = [
            'number_vac' => $request->number_vac ?? 0,
            'remarks' => $request->remarks ?? 'RECORD ONLY',
            'month' => $request->month,
            'barangay' => $request->barangay ?? 0,
        ];
        
        // Handling genderRows
        foreach ($request->genderRows as $row) {
            if ($row['gender'] === 'Male') {
                $data['male'] = $row['genderValue'];
            } elseif ($row['gender'] === 'Female') {
                $data['female'] = $row['genderValue'];
            }
        }
        
        // Handling ageRows
        foreach ($request->ageRows as $row) {
            switch ($row['age']) {
                case '0-4yr':
                    $data['range_one'] = $row['ageValue'];
                    break;
                case '6-9yr':
                    $data['range_two'] = $row['ageValue'];
                    break;
                case '10-14yr':
                    $data['range_three'] = $row['ageValue'];
                    break;
                case '15-17yr':
                    $data['range_four'] = $row['ageValue'];
                    break;
                case '18 up PWD':
                    $data['range_five'] = $row['ageValue'];
                    break;
            }
        }
        
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
                case 'Neglect':
                    $data['neglect'] = $row['abuseValue'];
                    break;
                case 'Others':
                    $data['others'] = $row['abuseValue'];
                    break;
            }
        }
        
        // Handling perpetratorsRows
        foreach ($request->perpetratorsRows as $row) {
            switch ($row['perpetrator']) {
                case 'Immediate Family':
                    $data['immediate_family'] = $row['perpetratorValue'];
                    break;
                case 'Other Close Relative(s)':
                    $data['other_close_relative'] = $row['perpetratorValue'];
                    break;
                case 'Acquaintance':
                    $data['acquaintance'] = $row['perpetratorValue'];
                    break;
                case 'Stranger':
                    $data['stranger'] = $row['perpetratorValue'];
                    break;
                case 'Local Official':
                    $data['local_official'] = $row['perpetratorValue'];
                    break;
                case 'Law Enforcer':
                    $data['law_enforcer'] = $row['perpetratorValue'];
                    break;
                case 'Other (Guardians)':
                    $data['other_guardians'] = $row['perpetratorValue'];
                    break;
            }
        }
        
        // Handling actionRows
        foreach ($request->actionRows as $row) {
            switch ($row['action']) {
                case 'Referred to PNP':
                    $data['referred_pnp'] = $row['actionValue'];
                    break;
                case 'Referred to NBI':
                    $data['referred_nbi'] = $row['actionValue'];
                    break;
                case 'Referred for Medical':
                    $data['referred_medical'] = $row['actionValue'];
                    break;
                case 'Referred for Legal Assist':
                    $data['referred_legal_assist'] = $row['actionValue'];
                    break;
                case 'Others: (NGO, GBOS)':
                    $data['referred_others'] = $row['actionValue'];
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
