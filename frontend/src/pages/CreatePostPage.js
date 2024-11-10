import { useState, useEffect } from 'react';
import { checkAuth } from '../util.js';

export default function CreatePostPage() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(checkAuth());
        document.title = "Create Post";
    }, []);

    if (!loggedIn) {
        return (
            <div class="container w-25 bd-blue-1t rounded-5 p-4 mt-5 text-center">
                <h2>Not logged in.</h2>
            </div>
        );
    }
    return (
        <div class="container bd-blue-4t rounded-5 px-0 my-5">
            <div class="row p-3 text-start">
                <h4>Create post:</h4>
            </div>

            <div class="container bd-blue-1t rounded-5 p-3 text-end">
                <input type="text" class="form-control mb-4 rounded-4" id="postTitleInput" placeholder="Post Title" />
                <textarea class="form-control mb-4 rounded-4" id="postBodyInput" rows="6" placeholder="Post Body" />
                <button class="btn btn-primary mx-2" onClick={() => createPost()}>Create Post</button>
            </div>
        </div>
    );
}

async function createPost() {
    let postTitle = document.getElementById("postTitleInput").value.replace("\n", "").replace("\r", "").trim();
    let postBody = document.getElementById("postBodyInput").value.trim();

    if (postTitle.length === 0) {
        alert("Post title cannot be empty!");
        return;
    }
    if (postBody.length === 0) {
        alert("Post body cannot be empty!");
        return;
    }

    let res = await fetch("http://localhost:42370/createpost", {
        method: "POST",
        body: JSON.stringify({
            postTitle: postTitle,
            postBody: postBody,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });

    if (!res.ok) {
        alert(await res.text());
    } else {
        window.location.href = "http://localhost:3000/post?post=" + (await res.json()).id;
    }
}