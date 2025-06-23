<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Mockery\Undefined;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {

        $validated = $request->validated();


        $avatarString = $validated['avatarString'] ?? null; // Safely get the value or null

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');

            $path = $avatar->store('avatars', 'public');

            $validated['avatar'] = $path;

            $deletePath =  asset('storage/' . $request->user()->avatar);;


            Storage::disk('public')->delete($deletePath);
        } else {

            $validated['avatar'] = $avatarString;
        }


        $request->user()->fill($validated);




        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }




        $request->user()->save();

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
