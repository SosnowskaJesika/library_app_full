import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "./views/NotFound.jsx";
import Books from "./views/Books.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import Authors from "./views/Authors.jsx";
import BookForm from "./views/BookForm.jsx";
import AuthorForm from "./views/AuthorForm.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/books" />,
            },
            {
                path: "/books",
                element: <Books />,
            },
            {
                path: "/book/new",
                element: <BookForm key="bookCreate" />,
            },
            {
                path: "/book/:id",
                element: <BookForm key="bookEdit" />,
            },
            {
                path: "/authors",
                element: <Authors />,
            },
            {
                path: "/author/new",
                element: <AuthorForm key="authorCreate" />,
            },
            {
                path: "/author/:name",
                element: <AuthorForm key="authorEdit" />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
