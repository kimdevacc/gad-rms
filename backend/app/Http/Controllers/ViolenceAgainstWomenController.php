<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Resources\ViolenceAgainstWomenResource;
use App\Models\ViolenceAgainstWomen;
use App\Models\Barangay;

class ViolenceAgainstWomenController extends Controller
{

    public function get_all_vaws(Request $request) {

        $currentUser = $request->user();
        if($currentUser->role === 'super admin') {
            $year = $request->year;
            $month = $request->month;

            $barangays = Barangay::all()->pluck('name');

            $barangayData = [];
            foreach ($barangays as $barangay) {
                $brgy = Barangay::where('name', $barangay)->first();
                $vaw = ViolenceAgainstWomen::where('month', $month)
                ->where('barangay', $brgy['id'])
                ->whereBetween('violence_against_women.created_at', [
                    Carbon::create($year, 1, 1)->startOfYear(),
                    Carbon::create($year, 12, 31)->endOfYear()
                ])
                ->first();

                if(isset($vaw)) {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vaw' => $vaw->number_vaw ?? 0,
                        'physical_abuse' => $vaw->physical_abuse ?? 0,
                        'sexual_abuse' => $vaw->sexual_abuse ?? 0,
                        'psychological_abuse' => $vaw->psychological_abuse ?? 0,
                        'economic_abuse' => $vaw->economic_abuse ?? 0,
                        'issued_bpo' => $vaw->issued_bpo ?? 0,
                        'referred_lowdo' => $vaw->referred_lowdo ?? 0,
                        'referred_pnp' => $vaw->referred_pnp ?? 0,
                        'referred_nbi' => $vaw->referred_nbi ?? 0,
                        'referred_court' => $vaw->referred_court ?? 0,
                        'referred_medical' => $vaw->referred_medical ?? 0,
                        'trainings' => $vaw->trainings ?? 0,
                        'counseling' => $vaw->counseling ?? 0,
                        'iec' => $vaw->iec ?? 0,
                        'fund_allocation' => $vaw->fund_allocation ?? 0,
                        'total_actions' => $vaw->issued_bpo + $vaw->referred_lowdo + $vaw->referred_pnp + $vaw->referred_nbi + $vaw->referred_medical + $vaw->referred_court,
                        'status' => $vaw->status
                    ];
                } else {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vaw' => 0,
                        'physical_abuse' => 0,
                        'sexual_abuse' => 0,
                        'psychological_abuse' => 0,
                        'economic_abuse' => 0,
                        'issued_bpo' => 0,
                        'referred_lowdo' => 0,
                        'referred_pnp' => 0,
                        'referred_nbi' => 0,
                        'referred_court' => 0,
                        'referred_medical' => 0,
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
            $vaw = ViolenceAgainstWomen::where('month', $month)
            ->where('barangay', $currentUser->barangay)
            ->whereBetween('violence_against_women.created_at', [
                Carbon::create($year, 1, 1)->startOfYear(),
                Carbon::create($year, 12, 31)->endOfYear()
            ])
            ->first();

            $brgy = Barangay::where('id', $currentUser->barangay)->first();

            if(isset($vaw)) {
                $barangayData[] = [
                    'month' => $month,
                    'barangay' => $brgy->name,
                    'number_vaw' => $vaw->number_vaw ?? 0,
                    'physical_abuse' => $vaw->physical_abuse ?? 0,
                    'sexual_abuse' => $vaw->sexual_abuse ?? 0,
                    'psychological_abuse' => $vaw->psychological_abuse ?? 0,
                    'economic_abuse' => $vaw->economic_abuse ?? 0,
                    'issued_bpo' => $vaw->issued_bpo ?? 0,
                    'referred_lowdo' => $vaw->referred_lowdo ?? 0,
                    'referred_pnp' => $vaw->referred_pnp ?? 0,
                    'referred_nbi' => $vaw->referred_nbi ?? 0,
                    'referred_court' => $vaw->referred_court ?? 0,
                    'referred_medical' => $vaw->referred_medical ?? 0,
                    'trainings' => $vaw->trainings ?? 0,
                    'counseling' => $vaw->counseling ?? 0,
                    'iec' => $vaw->iec ?? 0,
                    'fund_allocation' => $vaw->fund_allocation ?? 0,
                    'total_actions' => 0,
                    'status' => $vaw->status
                ];
            }

            return response()->json($barangayData);
        }
    }

    public function vaw(Request $request) {
        $vaw = ViolenceAgainstWomen::findOrFail($request->id);

        return new ViolenceAgainstWomenResource($vaw);
    }

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
            'status' => $request->status
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
