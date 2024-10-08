<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CitySeeder::class,
            BarangaySeeder::class,
            UserSeeder::class,
            ViolenceAgainstWomenSeeder::class,
            ViolenceAgainstChildrenSeeder::class,
            SettingsSeeder::class
        ]);
    }
}
