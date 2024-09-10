<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Resources\ViolenceAgainstChildrenResource;
use App\Models\ViolenceAgainstChildren;
use App\Models\Barangay;


class ViolenceAgainstChildrenController extends Controller
{
    public function get_all_vacs(Request $request) {
        $currentUser = $request->user();
        if($currentUser->role === 'super admin') {
            $year = $request->year;
            $month = $request->month;

            $barangays = Barangay::all()->pluck('name');

            $barangayData = [];
            foreach ($barangays as $barangay) {
                $brgy = Barangay::where('name', $barangay)->first();
                $vac = ViolenceAgainstChildren::where('month', $month)
                ->where('barangay', $brgy['id'])
                ->whereBetween('violence_against_children.created_at', [
                    Carbon::create($year, 1, 1)->startOfYear(),
                    Carbon::create($year, 12, 31)->endOfYear()
                ])
                ->first();

                if(isset($vac)) {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vac' => $vac->number_vac ?? 0,
                        'male' => $vac->male ?? 0,
                        'female' => $vac->female ?? 0,
                        'range_one' => $vac->range_one ?? 0,
                        'range_two' => $vac->range_two ?? 0,
                        'range_three' => $vac->range_three ?? 0,
                        'range_four' => $vac->range_four ?? 0,
                        'range_five' => $vac->range_five ?? 0,
                        'physical_abuse' => $vac->physical_abuse ?? 0,
                        'sexual_abuse' => $vac->sexual_abuse ?? 0,
                        'psychological_abuse' => $vac->psychological_abuse ?? 0,
                        'neglect' => $vac->neglect ?? 0,
                        'others' => $vac->others ?? 0,
                        'immediate_family' => $vac->immediate_family ?? 0,
                        'other_close_relative' => $vac->other_close_relative ?? 0,
                        'acquaintance' => $vac->acquaintance ?? 0,
                        'stranger' => $vac->stranger ?? 0,
                        'local_official' => $vac->local_official ?? 0,
                        'law_enforcer' => $vac->law_enforcer ?? 0,
                        'other_guardians' => $vac->other_guardians ?? 0,
                        'referred_pnp' => $vac->referred_pnp ?? 0,
                        'referred_nbi' => $vac->referred_nbi ?? 0,
                        'referred_medical' => $vac->referred_medical ?? 0,
                        'referred_legal_assist' => $vac->referred_legal_assist ?? 0,
                        'referred_others' => $vac->referred_others ?? 0,
                        'trainings' => $vac->trainings ?? 0,
                        'counseling' => $vac->counseling ?? 0,
                        'iec' => $vac->iec ?? 0,
                        'fund_allocation' => $vac->fund_allocation ?? 0,
                        'total_actions' => $vac->referred_others + $vac->referred_lowdo + $vac->referred_pnp + $vac->referred_nbi + $vac->referred_medical + $vac->referred_legal_assist,
                        'status' => $vac->status
                    ];
                } else {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vac' => 0,
                        'male' => 0,
                        'female' => 0,
                        'range_one' => 0,
                        'range_two' => 0,
                        'range_three' => 0,
                        'range_four' => 0,
                        'range_five' => 0,
                        'physical_abuse' => 0,
                        'sexual_abuse' => 0,
                        'psychological_abuse' => 0,
                        'neglect' => 0,
                        'others' => 0,
                        'immediate_family' => 0,
                        'other_close_relative' => 0,
                        'acquaintance' => 0,
                        'stranger' => 0,
                        'local_official' => 0,
                        'law_enforcer' => 0,
                        'other_guardians' => 0,
                        'referred_pnp' => 0,
                        'referred_nbi' => 0,
                        'referred_medical' => 0,
                        'referred_legal_assist' => 0,
                        'referred_others' => 0,
                        'trainings' => 0,
                        'counseling' => 0,
                        'iec' => 0,
                        'fund_allocation' => 0,
                        'total_actions' => 0,
                        'status' => 'Not Submitted'
                    ];
                }
            }

            return response()->json($barangayData);
        } else {
            $year = $request->year;
            $month = $request->month;

            $barangayData = [];
            $vac = ViolenceAgainstChildren::where('month', $month)
            ->where('barangay', $currentUser->barangay)
            ->whereBetween('violence_against_women.created_at', [
                Carbon::create($year, 1, 1)->startOfYear(),
                Carbon::create($year, 12, 31)->endOfYear()
            ])
            ->first();

            $brgy = Barangay::where('id', $currentUser->barangay)->first();

            if(isset($vac)) {
                $barangayData[] = [
                    'month' => $month,
                    'barangay' => $brgy->name,
                    'number_vac' => $vac->number_vac ?? 0,
                    'physical_abuse' => $vac->physical_abuse ?? 0,
                    'sexual_abuse' => $vac->sexual_abuse ?? 0,
                    'psychological_abuse' => $vac->psychological_abuse ?? 0,
                    'economic_abuse' => $vac->economic_abuse ?? 0,
                    'issued_bpo' => $vac->issued_bpo ?? 0,
                    'referred_lowdo' => $vac->referred_lowdo ?? 0,
                    'referred_pnp' => $vac->referred_pnp ?? 0,
                    'referred_nbi' => $vac->referred_nbi ?? 0,
                    'referred_court' => $vac->referred_court ?? 0,
                    'referred_medical' => $vac->referred_medical ?? 0,
                    'trainings' => $vac->trainings ?? 0,
                    'counseling' => $vac->counseling ?? 0,
                    'iec' => $vac->iec ?? 0,
                    'fund_allocation' => $vac->fund_allocation ?? 0,
                    'total_actions' => 0,
                    'status' => $vac->status
                ];
            }

            return response()->json($barangayData);
        }
    }

    public function vac(Request $request) {
        $vac = ViolenceAgainstChildren::findOrFail($request->id);

        return new ViolenceAgainstChildren($vac);
    }

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
        $vacs = ViolenceAgainstChildren::findOrFail($request->id);

        $data = $this->build_data($request);

        $vacs->update($data);

        return new ViolenceAgainstChildrenResource($vacs);
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
            'status' => $request->status
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
