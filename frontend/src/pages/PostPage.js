import { useState, useEffect } from 'react';
import { checkAuth, getUsername } from '../util.js';

function TitleBar({ postData }) {
    return (
        <div class="container bd-blue-1t rounded-4 p-3">
            <div class="row align-items-center">
                <div class="col-9">
                    <h4>{postData.title}</h4>
                </div>
                <div class="col-3 text-titlebar-info text-end">
                    Started by <b>{postData.author}</b> at {new Date(postData.created).toLocaleString("en-GB")}
                </div>
            </div>
        </div>
    );
}

function PostSection({ messages }) {
    for (var i in messages) {
        messages[i].number = Number(i) + 1;
    }

    const listReplies = messages.map(msg => {
        return (
            <div key={msg._id} class="container mb-3 px-0">
                <div class="row gx-3">
                    <div class="col-2">
                        <div class="container bd-blue-1t rounded-4 text-center">
                            <img src={process.env.PUBLIC_URL + "user.svg"} alt="User" class="w-75 container bd-white rounded-4 border border-primary-subtle mt-4 p-0" /><br />
                            <div class="py-3">
                                <b>{msg.author}</b>
                            </div>
                        </div>
                    </div>
                    <div class="col-10">
                        <div class="container bd-blue-1t rounded-4">
                            <div class="row">
                                <div class="col-1 container bd-blue-4t round-post-info text-post-info text-center">
                                    #{msg.number}
                                </div>
                                <div class="col-11" />
                            </div>

                            <div class="m-3 h-100">
                                <p>{msg.body.split("\n").map(line => <>{line}<br /></>)}</p>
                            </div>

                            <div class="row">
                                <div class="col-9" />
                                <div class="col-3 container bd-blue-4t round-post-info text-post-info text-end">
                                    Posted {new Date(msg.created).toLocaleString("en-GB")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div>
            {listReplies}
        </div>
    );
}

function ReplySection({ curPost, postAuthor }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    useEffect(() => {
        setLoggedIn(checkAuth());
        setUsername(getUsername());
    }, []);

    if (loggedIn) {
        if (username === postAuthor) {
            return (
            <>
                <div class="container bd-blue-4t rounded-5 px-0">
                    <div class="row p-3 text-start">
                        <h4>Reply to this post:</h4>
                    </div>

                    <div class="container bd-blue-1t rounded-5 p-3 text-end">
                        <textarea class="form-control rounded-4" id="replyBodyInput" rows="6" placeholder="Reply Body" />
                        <button class="btn btn-primary mx-3 mt-3" onClick={() => createPostReply(curPost)}>Create Post</button>
                    </div>
                </div>
                <div class="container text-end">
                    <button class="btn btn-danger mt-5" onClick={() => deletePost(curPost)}>Delete Post</button>
                </div>
            </>
            )
        }
        return (
            <>
                <div class="container bd-blue-4t rounded-5 px-0">
                    <div class="row p-3 text-start">
                        <h4>Reply to this post:</h4>
                    </div>

                    <div class="container bd-blue-1t rounded-5 p-3 text-end">
                        <textarea class="form-control rounded-4" id="replyBodyInput" rows="6" placeholder="Reply Body" />
                        <button class="btn btn-primary mx-3 mt-3" onClick={() => createPostReply(curPost)}>Create Post</button>
                    </div>
                </div>
                <div class="container text-end">
                    <button class="btn btn-danger mt-5" onClick={() => deletePost(curPost)} disabled>Only the author can delete a post.</button>
                </div>
            </>
        );
    } else {
        return (
            <div class="container bd-blue-1t rounded-4 p-3">
                <h4>Sign in to reply to this post.</h4>
            </div>
        );
    }
}

export default function PostPage() {
    const [postInvalid, setPostInvalid] = useState(false);
    const [curPost, setCurPost] = useState(1);
    const [postData, setPostData] = useState({});

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        const curPostTemp = queryParameters.get("post")
        if (curPostTemp) {
            fetch("http://localhost:42370/getpost?post=" + curPostTemp)
                .then(res => res.json())
                .then(
                    (result) => {
                        setPostData(result);
                        setCurPost(curPostTemp);
                        document.title = result.title;
                    },
                    (error) => {
                        setPostInvalid(true);
                        window.location.href = "http://localhost:3000/404";
                        console.log(error);
                    }
                );
        } else {
            setPostInvalid(true);
        }
    }, []);

    if (postInvalid) {
        window.location.href = "http://localhost:3000/404";
    } else {
        if (Object.keys(postData).length !== 0) {
            return (
                <div class="py-5">
                    <TitleBar postData={postData} />
                    <div class="py-2" />
                    <PostSection messages={postData.messages} />
                    <div class="py-3" />
                    <ReplySection curPost={curPost} postAuthor={postData.author}/>
                </div>
            );
        } else {
            // post must be loading if not invalid and data empty
            return "Loading...";
        }
    }
}

async function createPostReply(postID) {
    let replyBody = document.getElementById("replyBodyInput").value.trim();
    if (replyBody.length === 0) {
        alert("Reply body cannot be empty!");
        return;
    }

    console.log(replyBody);

    let res = await fetch("http://localhost:42370/createpostreply", {
        method: "POST",
        body: JSON.stringify({
            postID: postID,
            replyBody: replyBody,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });

    if (!res.ok) {
        alert(await res.text());
    } else {
        window.location.reload();
    }
}

async function deletePost(postID) {
    let res = await fetch("http://localhost:42370/deletepost", {
        method: "POST",
        body: JSON.stringify({
            postID: postID
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });

    if (!res.ok) {
        alert(await res.text());
    } else {
        window.location.href = "http://localhost:3000/forum";
    }
}