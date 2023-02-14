import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function DefaultLayout() {
    const { book, notification } = useStateContext();

    useEffect(() => {
        axiosClient.get("/book").then(({ data }) => {
            setBook(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/authors">Lista autorów</Link>

                <Link to="/books">Lista książek</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        <h1>Biblioteka</h1>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
            {notification && <div className="notification">{notification}</div>}
        </div>
    );
}
