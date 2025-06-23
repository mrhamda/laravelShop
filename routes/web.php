<?php

use App\Http\Controllers\PayPalController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('login', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });



Route::get('/', [PostController::class, 'index'])->middleware(['auth', 'verified'])->name('posts.index');

Route::get('/dashboard', [PostController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');

    Route::get('/posts/show/{id}', [PostController::class, 'show'])->name('posts.show');

    Route::get('/posts/user/{id}', [PostController::class, 'about'])->name('user.about');

    Route::get('/posts/edit/{id}', [PostController::class, 'edit'])->name('posts.edit');

    Route::get('/posts/view}', [PayPalController::class, 'index'])->name('posts.view');


    Route::patch('/posts/update/{id}', [PostController::class, 'update'])->name('posts.update');



    Route::delete('/posts/delete/{id}', [PostController::class, 'destroy'])->name('posts.destroy');

    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

    Route::get('/posts/find/{id}', [PostController::class, 'findPost'])->name('posts.find');


    Route::post('/posts/erase', [PostController::class, 'erase'])->name('posts.erase');

    Route::post('/posts/collectmoney', [PayPalController::class, 'createOrder'])->name('posts.collectmoney');


    Route::get('/posts/history', [PostController::class, 'history'])->name('posts.history');

    Route::get('/get-user/{id}', [PostController::class, 'getUser'])->name('get-user');


    Route::delete('/soldinfo/{id}', [PostController::class, 'removeSoldInfo'])->name('soldinfo');

    Route::delete('/managesoldinfo/{id}', [PostController::class, 'removeManageSoldInfo'])->name('managesoldinfo');





    Route::get('/posts/view', '\App\Http\Controllers\PayPalController@index');
    Route::get('/create/{amount}', '\App\Http\Controllers\PayPalController@create');
    Route::post('/complete', '\App\Http\Controllers\PayPalController@complete');
});

require __DIR__ . '/auth.php';
