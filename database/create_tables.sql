CREATE TABLE books
(
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           text    NOT NULL,
    publisher       text    NOT NULL,
    number_of_pages INTEGER NOT NULL,
    country         text    NOT NULL,
    status          text    NOT NULL,
    updated_at      text,
    created_at      text
);

-- CREATE TABLE authors
-- (
--     id         INTEGER PRIMARY KEY AUTOINCREMENT,
--     name       text NOT NULL,
--     country    text NOT NULL,
--     updated_at text,
--     created_at text
-- );

-- CREATE TABLE book_authors
-- (
--     id         INTEGER PRIMARY KEY AUTOINCREMENT,
--     book_id    INTEGER NOT NULL,
--     author_id  INTEGER NOT NULL,
--     updated_at text,
--     created_at text
-- );

ALTER TABLE books RENAME TO old_books