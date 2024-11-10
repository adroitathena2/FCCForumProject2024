import { useState, useEffect } from 'react';
import { checkAuth } from '../util.js';

export default function SignUpPage() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(checkAuth());
        document.title = "Sign up";
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
            <h4>Create Account</h4>
            <input type="text" class="form-control my-4" id="usernameInput" placeholder="Username" />
            <input type="text" class="form-control mb-4" id="realnameInput" placeholder="Name" />
            <input type="password" class="form-control mb-4" id="passwordInput" placeholder="Password" />
            <button class="btn btn-primary mx-2" onClick={() => signup()}>Sign Up</button>
        </div>
    );
}

async function signup() {
    let username = document.getElementById("usernameInput").value.replace("\n", "").replace("\r", "").trim();
    let password = document.getElementById("passwordInput").value.replace("\n", "").replace("\r", "").trim();
    let realname = document.getElementById("realnameInput").value.replace("\n", "").replace("\r", "").trim();

    if (username.length < 3) {
        alert("Username cannot be less than 3 characters in length!");
        return;
    }
    if (password.length < 6) {
        alert("Password cannot be less than 6 characters in length!");
        return;
    }
    if (realname.length === 0) {
        alert("Name cannot be empty!");
        return;
    }

    let res = await fetch("http://localhost:42370/signup", {
        method: "POST",
        body: JSON.stringify({
            username: username,
            realname: realname,
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