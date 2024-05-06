<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViolenceAgainstWomen extends Model
{
    use HasFactory;
    protected $table = 'violence_against_women';
    protected $fillable = [
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
}
