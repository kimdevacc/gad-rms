<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BarangayController;
use App\Http\Controllers\ViolenceAgainstWomenController;
use App\Http\Controllers\ViolenceAgainstChildrenController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/cities', [CityController::class, 'cities']);

    Route::get('/barangays', [BarangayController::class, 'barangays']);
    Route::get('/barangays/{cityId}', [BarangayController::class, 'barangays_by_city']);
    Route::get('/barangay/{id}', [BarangayController::class, 'get_barangay']);

    Route::get('/users', [UserController::class, 'users']);
    Route::post('/users', [UserController::class, 'store']);
    Route::patch('/users', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users/{id}', [UserController::class, 'get_user']);

    Route::get('/vaws', [ViolenceAgainstWomenController::class, 'vaws']);
    Route::post('/vaws', [ViolenceAgainstWomenController::class, 'store']);
    Route::patch('/vaws', [ViolenceAgainstWomenController::class, 'update']);
    Route::delete('/vaws/{id}', [ViolenceAgainstWomenController::class, 'destroy']);

    Route::get('/vacs', [ViolenceAgainstChildrenController::class, 'vacs']);
    Route::post('/vacs', [ViolenceAgainstChildrenController::class, 'store']);
    Route::patch('/vacs', [ViolenceAgainstChildrenController::class, 'update']);
    Route::delete('/vacs/{id}', [ViolenceAgainstChildrenController::class, 'destroy']);
});
