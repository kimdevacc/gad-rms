<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\ViolenceAgainstWomen;

class ViolenceAgainstWomenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $vaws=[
            array('month' => "January"),
            array('month' => "February"),
            array('month' => "March"),
            array('month' => "April"),
            array('month' => "May"),
            array('month' => "June"),
            array('month' => "July"),
            array('month' => "August"),
            array('month' => "September"),
            array('month' => "October"),
            array('month' => "November"),
            array('month' => "December")
        ];

        foreach($vaws as $vaw){
            ViolenceAgainstWomen::create([
                'month' => $vaw['month']
            ]);
        }
    }
}
