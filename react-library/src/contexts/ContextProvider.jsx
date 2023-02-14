import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    notification: null,
    setBook: () => {},
    setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
    const [book, setBook, author, setAuthor] = useState({});
    const [notification, _setNotification] = useState("");

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    return (
        <StateContext.Provider
            value={{
                author,
                book,
                notification,
                setBook,
                setNotification,
                setAuthor,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
