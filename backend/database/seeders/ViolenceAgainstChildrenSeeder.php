<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\ViolenceAgainstChildren;

class ViolenceAgainstChildrenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $vacs=[
            array('month' => "January", "number_vac" => rand(1, 500)),
            array('month' => "February", "number_vac" => rand(1, 500)),
            array('month' => "March", "number_vac" => rand(1, 500)),
            array('month' => "April", "number_vac" => rand(1, 500)),
            array('month' => "May", "number_vac" => rand(1, 500)),
            array('month' => "June", "number_vac" => rand(1, 500)),
            array('month' => "July", "number_vac" => rand(1, 500)),
            array('month' => "August", "number_vac" => rand(1, 500)),
            array('month' => "September", "number_vac" => rand(1, 500)),
            array('month' => "October", "number_vac" => rand(1, 500)),
            array('month' => "November", "number_vac" => rand(1, 500)),
            array('month' => "December", "number_vac" => rand(1, 500))
        ];

        foreach($vacs as $vac){
            ViolenceAgainstChildren::create([
                'month' => $vac['month'],
                'number_vac' => $vac['number_vac']
            ]);
        }
    }
}
