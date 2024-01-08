// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const cookieArray = document.cookie.split(";");
        const tokenRow = cookieArray.find((row) => row.startsWith("jwtCookie"));
        if (!tokenRow) {
            setLoggedIn(false);
            setUser(null);
            return;
        }
        const token = tokenRow.split("=")[1];
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setLoggedIn(true);
            setToken(token);
        }
    }, []);

    const login = async (userData) => {
        try {
            const response = await fetch("http://localhost:3000/api/session/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const { payload, token } = await response.json();

                // Save the token in localStorage
                localStorage.setItem("jwtToken", token);

                // Save the user payload
                localStorage.setItem("user", JSON.stringify(payload));

                setUser(payload);
                setLoggedIn(true);
                setToken(token);
            } else {
                throw new Error("Email or password incorrect");
            }
        } catch (error) {
            throw new Error("Error during login");
        }
    };

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/session/logout", {
                method: "GET",
                credentials: "include",
            });

            //Remove jwtCookie
            document.cookie = "jwtCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                localStorage.removeItem("user");
            }

            if (response.ok) {
                localStorage.removeItem("user");
                setUser(null);
                setLoggedIn(false);
            } else {
                throw new Error("Error during logout");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            throw new Error("Error during logout");
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loggedIn, token }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
