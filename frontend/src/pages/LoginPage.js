import { useState, useEffect } from 'react';
import { checkAuth } from '../util.js';

export default function LoginPage() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(checkAuth());
        document.title = "Log in";
    }, []);

    if (loggedIn) {
        return (
            <div class="container w-25 bd-blue-1t rounded-5 p-4 mt-5 text-center">
                <h2>Already logged in.</h2>
            </div>
        );
    }
    return (
        <div class="container w-25 bd-blue-1t rounded-5 p-4 mt-5 text-center">
            <h4>Log in</h4>
            <input type="text" class="form-control my-4" id="usernameInput" placeholder="Username" />
            <input type="password" class="form-control mb-4" id="passwordInput" placeholder="Password" />
            <button class="btn btn-primary mx-2" onClick={() => login()}>Log In</button>
            <button class="btn btn-primary mx-2" onClick={() => {
                window.location.href = "http://localhost:3000/signup";
            }}>Sign Up</button>
        </div>
    );
}

async function login() {
    let username = document.getElementById("usernameInput").value.replace("\n", "").replace("\r", "").trim();
    let password = document.getElementById("passwordInput").value.replace("\n", "").replace("\r", "").trim();

    if (username.length === 0) {
        alert("Username cannot be empty!");
        return;
    }
    if (password.length === 0) {
        alert("Password cannot be empty!");
        return;
    }

    let res = await fetch("http://localhost:42370/login", {
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });

    if (!res.ok) {
        alert(await res.text());
    } else {
        window.location.href = "http://localhost:3000/";
    }
}