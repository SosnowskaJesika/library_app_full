import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(theme) {
    return {
        fontWeight: theme.typography.fontWeightRegular,
    };
}

export default function BookForm() {
    const [authors, setAuthors] = useState([]);
    const [availability, setAvailability] = useState("");
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    let { id } = useParams();
    const [book, setBook] = useState({
        id: null,
        title: "",
        authors: [],
        publisher: "",
        number_of_pages: 0,
        country: "",
        status: "",
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
        setLoading(true);
        getAuthors(setLoading).then((authorsResponse) => {
            axiosClient.get(`/book/${id}`).then(({ data }) => {
                setBook({
                    ...data,
                    authors: data.authors.map(
                        ({ author_id, details: { name } }) => {
                            return authorsResponse.find(
                                ({ id }) => id === author_id
                            );
                        }
                    ),
                }).finally(() => {
                    setLoading(false);
                });
            });
        });
    }, []);

    const theme = useTheme();
    const handleChangeStatus = (event) => {
        setBook((prevState) => ({
            ...prevState,
            status: event.target.value,
        }));
        setAvailability(event.target.value);
    };

    const handleChange = (event) => {
        const { value } = event.target;

        if (value.length >= 4) {
            alert("Nie możesz dodać więcej niż 3 autorów!");
            return;
        }

        setBook((prevState) => {
            let newState = { ...prevState };
            newState.authors = value;
            return newState;
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const request = { ...book };
        request.authors = book.authors.map((authorValue) => {
            return authorValue.id;
        });
        if (book.id) {
            axiosClient
                .patch(`/book/${book.id}`, request)
                .then(() => {
                    setNotification("Książka została pomyślnie edytowana");
                    navigate("/books");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/book", request)
                .then(() => {
                    setNotification("Nowa książka została dodana");
                    navigate("/books");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    const getAuthors = (setLoadingCallback) => {
        setProcessing && setLoadingCallback(true);
        return axiosClient
            .get("/authors")
            .then(({ data }) => {
                setAuthors(data);
                return data;
            })
            .finally(() => {
                book.title;
                setProcessing && setLoadingCallback(false);
            });
    };

    if (!authors.length || loading || (id && !book.id)) return "Ładowanie...";

    return (
        <>
            {book.id && <h1>Edycja książki: {book.title}</h1>}
            {!book.id && <h1>Nowa książka</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Ładowanie...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <Box
                            sx={{
                                "& > :not(style)": {
                                    width: "100%",
                                    marginBottom: "15px",
                                },
                            }}
                        >
                            <TextField
                                label="Tytuł"
                                variant="outlined"
                                defaultValue={book.title}
                                onChange={(e) => {
                                    setBook((prevState) => ({
                                        ...prevState,
                                        title: e.target.value,
                                    }));
                                }}
                            />

                            <div>
                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel>Autor</InputLabel>
                                    <Select
                                        multiple
                                        value={book.authors}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Chip" />}
                                        renderValue={(selected) => (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 0.5,
                                                }}
                                            >
                                                {selected.map((value) => (
                                                    <Chip
                                                        key={value?.name}
                                                        label={value?.name}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {authors.map((el) => (
                                            <MenuItem
                                                key={el?.name}
                                                value={el}
                                                style={getStyles(theme)}
                                            >
                                                {el?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <TextField
                                label="Wydawnictwo"
                                variant="outlined"
                                onChange={(e) => {
                                    setBook((prevState) => ({
                                        ...prevState,
                                        publisher: e.target.value,
                                    }));
                                }}
                                defaultValue={book.publisher}
                            />

                            <TextField
                                label="Liczba stron"
                                variant="outlined"
                                onChange={(e) => {
                                    setBook((prevState) => ({
                                        ...prevState,
                                        number_of_pages: e.target.value,
                                    }));
                                }}
                                inputProps={{
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                }}
                                defaultValue={book.number_of_pages}
                            />

                            <TextField
                                defaultValue={book.country}
                                label="Kraj pochodzenia"
                                variant="outlined"
                                onChange={(e) => {
                                    setBook((prevState) => ({
                                        ...prevState,
                                        country: e.target.value,
                                    }));
                                }}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={book.status}
                                    label="Status"
                                    onChange={handleChangeStatus}
                                >
                                    <MenuItem value={"available"}>
                                        Dostępna
                                    </MenuItem>
                                    <MenuItem value={"not-available"}>
                                        Niedostępna
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <button className="btn">Zapisz</button>
                    </form>
                )}
            </div>
        </>
    );
}
