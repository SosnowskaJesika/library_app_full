<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;

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

Route::middleware('auth:sanctum')->group(function() {
    
});

Route::get('/books', [BookController::class, 'getAll']);
Route::post('/book', [BookController::class, 'insert']);
Route::delete('/book/{id}', [BookController::class, 'delete']);
Route::get('/book/{id}', [BookController::class, 'getByID']);
Route::patch('/book/{id}', [BookController::class, 'edit']);
Route::get('/book/by_author/{author}', [BookController::class, 'getByAuthor']);

Route::get('/authors', [AuthorController::class, 'getAll']);
Route::post('/author', [AuthorController::class, 'insert']);
Route::delete('/author/{id}', [AuthorController::class, 'delete']);
Route::patch('/author/{id}', [AuthorController::class, 'edit']);
Route::get('/author/{author}', [AuthorController::class, 'getByAuthor']);
