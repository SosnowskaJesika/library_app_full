<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookAuthors extends Model
{
    use HasFactory;

    protected $table = 'book_authors';

    public function details() {
        return $this->belongsTo('App\Models\Author', 'author_id', 'id');
    }
}
