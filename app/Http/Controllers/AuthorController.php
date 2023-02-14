<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function getAll()
    {
        $result = Author::all()->jsonSerialize();
        return response()->json($result);
    }

    public function insert(Request $request)
    {
        $data = $request->json()->all();

        $author = new Author;
        $author->name = $data['name'];
        $author->country = $data['country'];
        $author->save();

        return 'success';
    }

    public function delete(int $id)
    {
        $result = Author::where('id', $id)->delete();;

        return $result > 0
            ? response("success", 200)
            : response("not_found", 404);
    }

    public function edit(Request $request, int $id)
    {
        $data = $request->json()->all();

        $result = Author::where('id', $id)->update([
            'name' => $data['name'],
            'country' => $data['country'],
        ]);

        return $result > 0
            ? response("success", 200)
            : response("not_found", 404);
    }

    public function getByAuthor(Request $request, string $author)
    {
        return Author::where('name', 'LIKE', '%' . $author . '%')->get()[0];
    }
}
