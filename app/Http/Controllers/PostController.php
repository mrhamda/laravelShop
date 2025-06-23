<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostRequest;
use App\Http\Requests\updatePostRequest;
use App\Models\collectMoneyModel;
use App\Models\manageSoldModel;
use App\Models\Post;
use App\Models\soldInfoModel;
use App\Models\User;
use BcMath\Number;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use function Pest\Laravel\delete;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::all();
        $user = Auth::user();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'user' => $user
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('posts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        $validated = $request->validated();

        $storedPath = $validated['image']->store('image', 'public');

        Post::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => (int)$validated['price'],
            'image' => $storedPath,
            'user_id' => Auth::id(),
            'quantity' => (int)$validated['quantity']
        ]);

        return redirect()->route(
            'user.about',
            ["id" => Auth::id()]
        )->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::findOrFail($id);


        $user = Auth::user();
        $postUser = User::find($post->user_id);



        return Inertia::render('posts/show', [
            'post' => $post,
            'user' => $user,
            'postUser' => $postUser
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

        $post = Post::findOrFail($id);

        $user = User::findOrFail($post->user_id);


        return Inertia::render('posts/edit', [
            'post' => $post,
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(updatePostRequest $request, string $id)
    {

        // dd($request->all());


        $validated = $request->validated();


        $post = Post::findOrFail($id);

        $imageString = $validated['imageString'] ?? null;

        $validated['image'] = $imageString;


        if ($request->hasFile('image')) {
            $image = $request->file('image');

            $path = $image->store('image', 'public');

            $validated['image'] = $path;

            $deletePath =  asset('storage/' . $request->user()->image);;


            Storage::disk('public')->delete($deletePath);
        }


        $post->fill($validated);



        $post->save();



        return Redirect::route('posts.show', $post->id)->with('success', 'Post updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);


        $imgPath = "/storage/image/{$post['image']}";



        if ($post->image && Storage::disk('public')->exists($imgPath)) {
            Storage::disk('public')->delete("{$imgPath}");
        }

        $userID = $post['user_id'];


        $post->delete();

        //Fix so that it displays msg deleted 

        // then do edit!

        return redirect()->route('user.about', ['id' => $userID])->with('success', 'Post Deleted successfully.');
    }


    public function about(string $id)
    {

        $authenticatedUser = Auth::user();

        $postUser = User::findOrFail($id);

        $userPostsOnly = Post::where('user_id', $id)->get();


        return Inertia::render('posts/about', [
            'user' => $authenticatedUser,
            'posts' => $userPostsOnly,
            'postUser' => $postUser
        ]);
    }

    public function view()
    {
        $user = Auth::user();



        return Inertia::render('posts/view', [
            'user' => $user
        ]);
    }


    public function findPost($id)
    {
        $post = Post::find($id);

        return response()->json($post);
    }


    public function erase(Request $req)
    {


        $allDatas = $req->json()->all();



        foreach ($allDatas as $oneItem) {
            $post = Post::findOrFail($oneItem['id']);

            if ($oneItem['quantity'] <= $post['quantity']) {
                $total = $oneItem['quantity'] *  $post['price'];
                soldInfoModel::create([
                    'title'        => (string)  $post['title'],
                    'total'        => (string) $total,
                    'quantity'     => (string) $oneItem['quantity'],
                    'from_user_id' => (string) Auth::id(),
                    'to_user_id'   => (string) $post['user_id']
                ]);

                $collectMoneyGuy = collectMoneyModel::find($post['user_id']);

                if ($collectMoneyGuy == null) {
                    collectMoneyModel::create([
                        'user_id' => (string) $post['user_id'],
                        'money' => (string) $total
                    ]);
                } else {
                    $collectMoneyGuy->update([
                        'money' => (string) $collectMoneyGuy['money'] + $total
                    ]);
                }

                manageSoldModel::create([
                    'title'        => (string)  $post['title'],
                    'total'        => (string) $total,
                    'quantity'     => (string) $oneItem['quantity'],
                    'from_user_id' => (string) $post['user_id'],
                    'to_user_id'   => (string) Auth::id()
                ]);
            }


            if ($oneItem['quantity'] < $post['quantity']) {
                $leftQuantity = $post['quantity'] - $oneItem['quantity'];

                $post->update([
                    'quantity' => $leftQuantity,
                ]);
            } else if ($oneItem['quantity'] == $post['quantity']) {
                $post->delete();
            } else if ($oneItem['quantity'] > $post['quantity']) {
            }
        }






        return response()->json([
            'message' => 'Posts erased',
        ]);
    }


    public function history()
    {
        $posts = Post::all();
        $user = Auth::user();

        $allBought = soldInfoModel::where('from_user_id', $user['id'])->get();

        $allManages = manageSoldModel::where('from_user_id', $user['id'])->get();

        $moneyToCollect = collectMoneyModel::where('user_id', $user['id'])->get();


        return Inertia::render('posts/history', [
            'posts' => $posts,
            'user' => $user,
            'boughtInfo' => $allBought,
            'allManages' => $allManages,
            'moneyToCollect' => $moneyToCollect

        ]);
    }


    public function getUser($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }


    public function removeSoldInfo($id)
    {
        $soldInfoModel = soldInfoModel::findOrFail($id);

        $soldInfoModel->delete();

        return redirect()->route('posts.history')->with('success', 'Transcation Deleted successfully.');
    }

    public function removeManageSoldInfo($id)
    {
        $soldInfoModel = manageSoldModel::findOrFail($id);

        $soldInfoModel->delete();

        return redirect()->route('posts.history')->with('success', 'Transcation Deleted successfully.');
    }
}
