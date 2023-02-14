import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Authors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
        getAuthors(setLoading);
    }, []);

    const onDeleteClick = (author) => {
        if (!window.confirm(`Czy chcesz usunąć ${author.name}?`)) {
            return;
        }
        setProcessing(true);
        axiosClient.delete(`/author/${author.id}`).then(() => {
            setNotification("Autor został usunięty");
            getAuthors(setProcessing);
        });
    };

    const getAuthors = (setLoadingCallback) => {
        setProcessing && setLoadingCallback(true);
        return axiosClient
            .get("/authors")
            .then(({ data }) => {
                setAuthors(data);
            })
            .finally(() => {
                setProcessing && setLoadingCallback(false);
            });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Lista autorów</h1>

                <Link className="btn-add" to="/author/new">
                    Dodaj nowego
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Autor</th>
                            <th>Kraj</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Ładowanie...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {authors.map((el) => (
                                <tr key={el.id}>
                                    <td>{el.name}</td>
                                    <td>{el.country}</td>
                                    <td>
                                        <Link
                                            disabled={processing}
                                            className="btn-edit"
                                            to={"/author/" + el.name}
                                        >
                                            Edytuj
                                        </Link>
                                        &nbsp;
                                        <button
                                            disabled={processing}
                                            className="btn-delete"
                                            onClick={(ev) => onDeleteClick(el)}
                                        >
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
