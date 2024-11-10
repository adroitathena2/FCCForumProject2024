import { Outlet } from "react-router-dom";
import { checkAuth } from './util.js';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

function LoginOutButton() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(checkAuth());
    }, []);

    if (loggedIn) {
        return (
            <button type="button" class="btn btn-primary" onClick={async () => {
                let res = await fetch("http://localhost:42370/logout", {
                    method: "POST",
                    credentials: "include"
                });

                if (!res.ok) {
                    if (Cookies.get("session") || Cookies.get("username")) {
                        alert("Invalidated login!");
                    } else {
                        alert(await res.text());
                    }

                    Cookies.remove("session");
                    Cookies.remove("username");
                }
                window.location.reload();
            }}>Logout</button>
        );
    } else {
        return <button type="button" class="btn btn-primary" onClick={() => { window.location.href = "http://localhost:3000/login"; }}>Login</button>;
    }
}

function AccountShow() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(checkAuth());
    }, []);

    if (loggedIn) {
        return <p class="mb-0">Logged in as: <b>{Cookies.get("username")}</b></p>;
    } else {
        return "Not signed in.";
    }
}

export default function Root() {
    return (
        <>
            <main class="bg-image min-vh-100">
                <nav class="navbar navbar-expand-sm bd-blue-1t">
                    <div class="container-sm text-center">
                        <a class="navbar-brand" href=".">App</a>
                        <AccountShow/>
                        <LoginOutButton/>
                    </div>
                </nav>


                <Outlet/>
            </main>
        </>
    );
}