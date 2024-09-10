<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BarangayController;
use App\Http\Controllers\ViolenceAgainstWomenController;
use App\Http\Controllers\ViolenceAgainstChildrenController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AuditsController;
use App\Http\Controllers\ArchiveController;

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
    Route::get('/user/notifications', [UserController::class, 'notifications']);

    Route::get('/vaws', [ViolenceAgainstWomenController::class, 'vaws']);
    Route::get('/vaw/{id}', [ViolenceAgainstWomenController::class, 'vaw']);
    Route::get('/vaws/all/{year}/{month}', [ViolenceAgainstWomenController::class, 'get_all_vaws']);
    Route::post('/vaws', [ViolenceAgainstWomenController::class, 'store']);
    Route::patch('/vaws', [ViolenceAgainstWomenController::class, 'update']);
    Route::delete('/vaws/{id}', [ViolenceAgainstWomenController::class, 'destroy']);

    Route::get('/vacs', [ViolenceAgainstChildrenController::class, 'vacs']);
    Route::get('/vac/{id}', [ViolenceAgainstWomenController::class, 'vac']);
    Route::get('/vacs/all/{year}/{month}', [ViolenceAgainstChildrenController::class, 'get_all_vacs']);
    Route::post('/vacs', [ViolenceAgainstChildrenController::class, 'store']);
    Route::patch('/vacs', [ViolenceAgainstChildrenController::class, 'update']);
    Route::delete('/vacs/{id}', [ViolenceAgainstChildrenController::class, 'destroy']);

    Route::get('/settings', [SettingsController::class, 'settings']);
    Route::post('/settings', [SettingsController::class, 'store']);
    Route::patch('/settings', [SettingsController::class, 'update']);
    Route::delete('/settings/{id}', [SettingsController::class, 'destroy']);

    Route::get('/audits', [AuditsController::class, 'audits']);

    Route::get('/archives', [ArchiveController::class, 'archives']);
    Route::post('/restore', [ArchiveController::class, 'restore']);
});
