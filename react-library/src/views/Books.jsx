import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Books() {
    const [authors, setAuthors] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { setNotification } = useStateContext();
    const [selectedOptions, setSelectedOptions] = useState(null);

    useEffect(() => {
        getBooks(setLoading);
        getAuthors(setLoading);
    }, []);

    const onDeleteClick = (book) => {
        if (!window.confirm(`Czy chcesz usunąć "${book.title}"?`)) {
            return;
        }
        setProcessing(true);
        axiosClient.delete(`/book/${book.id}`).then(() => {
            setNotification("Książka została usunięta");
            getBooks(setProcessing);
        });
    };

    const getBooks = (setLoadingCallback) => {
        setProcessing && setLoadingCallback(true);
        return axiosClient
            .get("/books")
            .then(({ data }) => {
                setBooks(data);
            })
            .finally(() => {
                setProcessing && setLoadingCallback(false);
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

    const handleChange = (event, value) => setSelectedOptions(value);

    const booksAuthor = authors.map((e) => {
        return e?.name;
    });

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Lista książek</h1>
                <Autocomplete
                    onChange={handleChange}
                    disablePortal
                    options={booksAuthor}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Szukaj autora"
                        ></TextField>
                    )}
                />
                <Link className="btn-add" to="/book/new">
                    Dodaj nową
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Tytuł</th>
                            <th>Autor</th>
                            <th>Wydawnictwo</th>
                            <th>Ilość stron</th>
                            <th>Kraj</th>
                            <th>Status</th>
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
                            {selectedOptions === null
                                ? books.map((el) => (
                                      <tr key={el.id}>
                                          <td>{el.title}</td>
                                          <td>
                                              {el.authors.map(({ details }) => {
                                                  return details?.name + ", ";
                                              })}
                                          </td>
                                          <td>{el.publisher}</td>
                                          <td>{el.number_of_pages}</td>
                                          <td>{el.country}</td>
                                          <td>
                                              {el.status === "available"
                                                  ? "Dostępna"
                                                  : "Niedostępna"}
                                          </td>
                                          <td>
                                              <Link
                                                  disabled={processing}
                                                  className="btn-edit"
                                                  to={"/book/" + el.id}
                                              >
                                                  Edytuj
                                              </Link>
                                              &nbsp;
                                              <button
                                                  disabled={processing}
                                                  className="btn-delete"
                                                  onClick={(ev) =>
                                                      onDeleteClick(el)
                                                  }
                                              >
                                                  Usuń
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                                : books.map((el) =>
                                      el.authors.find(
                                          ({ details }) =>
                                              details?.name === selectedOptions
                                      ) ? (
                                          <tr key={el.id}>
                                              <td>{el.title}</td>
                                              <td>
                                                  {el.authors.map(
                                                      ({ details }) => {
                                                          return (
                                                              details?.name +
                                                              ", "
                                                          );
                                                      }
                                                  )}
                                              </td>
                                              <td>{el.publisher}</td>
                                              <td>{el.number_of_pages}</td>
                                              <td>{el.country}</td>
                                              <td>
                                                  {el.status === "available"
                                                      ? "Dostępna"
                                                      : "Niedostępna"}
                                              </td>
                                              <td>
                                                  <Link
                                                      disabled={processing}
                                                      className="btn-edit"
                                                      to={"/book/" + el.id}
                                                  >
                                                      Edytuj
                                                  </Link>
                                                  &nbsp;
                                                  <button
                                                      disabled={processing}
                                                      className="btn-delete"
                                                      onClick={(ev) =>
                                                          onDeleteClick(el)
                                                      }
                                                  >
                                                      Usuń
                                                  </button>
                                              </td>
                                          </tr>
                                      ) : (
                                          ""
                                      )
                                  )}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
