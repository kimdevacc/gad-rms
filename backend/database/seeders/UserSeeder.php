<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::create([
            'first_name' => 'Suichi',
            'last_name' => 'Minamino',
            'email' => 'sm@gmail.com',
            'password' => Hash::make('12345'),
            'email_verified_at' => now(),
            'address_line_1' => 'Adipisci nostrud et',
            'role' => 'super admin',
            'city' => 1,
            'barangay' => 1,
            'contact_number' => '0923462374'
        ]);

        \App\Models\User::create([
            'first_name' => 'Amanda',
            'last_name' => 'Alsop',
            'email' => 'amanda.alsop@gmail.com',
            'password' => Hash::make('12345'),
            'email_verified_at' => now(),
            'address_line_1' => 'Adipisci nostrud et',
            'role' => 'super admin',
            'city' => 1,
            'barangay' => 2,
            'contact_number' => '0923462374'
        ]);

        \App\Models\User::factory(26)->create();
    }
}
