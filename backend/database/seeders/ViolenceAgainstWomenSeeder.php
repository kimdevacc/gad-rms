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
            array('month' => "January", "number_vaw" => rand(1, 500)),
            array('month' => "February", "number_vaw" => rand(1, 500)),
            array('month' => "March", "number_vaw" => rand(1, 500)),
            array('month' => "April", "number_vaw" => rand(1, 500)),
            array('month' => "May", "number_vaw" => rand(1, 500)),
            array('month' => "June", "number_vaw" => rand(1, 500)),
            array('month' => "July", "number_vaw" => rand(1, 500)),
            array('month' => "August", "number_vaw" => rand(1, 500)),
            array('month' => "September", "number_vaw" => rand(1, 500)),
            array('month' => "October", "number_vaw" => rand(1, 500)),
            array('month' => "November", "number_vaw" => rand(1, 500)),
            array('month' => "December", "number_vaw" => rand(1, 500))
        ];

        foreach($vaws as $vaw){
            ViolenceAgainstWomen::create([
                'month' => $vaw['month'],
                'number_vaw' => $vaw['number_vaw']
            ]);
        }
    }
}
