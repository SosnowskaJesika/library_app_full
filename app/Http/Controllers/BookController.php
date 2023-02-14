<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookAuthors;
use Illuminate\Http\Request;

class BookController extends Controller
{

    public function getAll() {
        $results = Book::all()->jsonSerialize();

        foreach ($results as $key => $result) {
            $bookAuthors = BookAuthors::with(['details'])->where('book_id', $result['id'])->get();
            $results[$key]['authors'] = $bookAuthors->toArray();
        }

        return response()->json($results);
    }

    public function insert(Request $request)
    {
        $data = $request->json()->all();

        $book = new Book;
        $book->title = $data['title'];
        $book->publisher = $data['publisher'];
        $book->number_of_pages = $data['number_of_pages'];
        $book->country = $data['country'];
        $book->status = $data['status'];
        $book->save();

        foreach ($data['authors'] as $author) {
            $bookAuthors = new BookAuthors;
            $bookAuthors->book_id = $book->id;
            $bookAuthors->author_id = $author;
            $bookAuthors->save();
        }

        return 'success';
    }

    public function delete(int $id)
    {
        $result = Book::where('id', $id)->delete();

        return $result > 0
            ? response("success", 200)
            : response("not_found", 404);
    }

    public function edit(Request $request, int $id)
    {
        $data = $request->json()->all();

        $result = Book::where('id', $id)->update([
            'title' => $data['title'],
            'publisher' => $data['publisher'],
            'number_of_pages' => $data['number_of_pages'],
            'country' => $data['country'],
            'status' => $data['status'],
        ]);

        BookAuthors::where('book_id', $id)->delete();

        foreach ($data['authors'] as $author) {
            $bookAuthors = new BookAuthors;
            $bookAuthors->book_id =$id;
            $bookAuthors->author_id = $author;
            $bookAuthors->save();
        }

        return $result > 0
            ? response("success", 200)
            : response("not_found", 404);
    }

    public function getByAuthor(Request $request, string $author)
    {
        return "unavailable";
        // return Book::where('author', 'LIKE', '%' . $author . '%')->get();
    }

    public function getById(Request $request, int $id)
    {
        $result = Book::where('id', $id)->get()[0];

        $bookAuthors = BookAuthors::with(['details'])->where('book_id', $result['id'])->get();
            $result['authors'] = $bookAuthors->toArray();
        return response()->json($result);
    }
}
