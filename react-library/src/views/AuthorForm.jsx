import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function AuthorForm() {
    let { name } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState({
        name: "",
        country: "",
    });

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/author/${name}`)
            .then(({ data }) => {
                setLoading(false);
                setAuthor(data);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        if (author.id) {
            axiosClient
                .patch(`/author/${author.id}`, author)
                .then(() => {
                    setNotification("Autor został pomyślnie edytowany");
                    navigate("/authors");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/author", author)
                .then(() => {
                    setNotification("Nowy autor został dodany");
                    navigate("/authors");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <>
            {author.id && <h1>Edycja autora: {author.name}</h1>}
            {!author.id && <h1>Nowy autor</h1>}
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
                            component="form"
                            sx={{
                                "& > :not(style)": {
                                    width: "100%",
                                    marginBottom: "15px",
                                },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                label="Autor"
                                variant="outlined"
                                defaultValue={author.name}
                                onChange={(e) => {
                                    setAuthor({
                                        ...author,
                                        name: e.target.value,
                                    });
                                }}
                            />

                            <TextField
                                label="Kraj pochodzenia"
                                variant="outlined"
                                defaultValue={author.country}
                                onChange={(e) => {
                                    setAuthor({
                                        ...author,
                                        country: e.target.value,
                                    });
                                }}
                            />
                        </Box>
                        <button className="btn">Zapisz</button>
                    </form>
                )}
            </div>
        </>
    );
}
