import { useState, useEffect } from 'react';
import { checkAuth } from '../util.js';

function CreateButton() {
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        setShowCreate(checkAuth());
    }, []);

    if (showCreate) {
        return (
            <div class="col-4 text-end px-5">
                <button class="btn btn-primary" onClick={() => { window.location.href = "http://localhost:3000/createpost"; }}>Create</button>
            </div>
        );
    }
    return <></>;
}

function Posts() {
    const [curPage, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:42370/getposts?page=" + curPage)
            .then(res => res.json())
            .then(
                (result) => {
                    setPosts(result.posts.map(post => {
                        var ret = post;
                        ret.created = new Date(post.created);
                        return ret;
                    }));
                    setLastPage(result.numPages);
                },

                (error) => {
                    console.log(error);
                }
            )
    }, [curPage]);

    const listPosts = posts.map(post =>
        <div class="row" key={post.id}>
            <div class="col-7">
                <p class="text-truncate border bg-body border-primary mb-1 py-1 px-3 rounded-2">
                    <a href={"post?post=" + post.id} class="text-nounderline">
                        {post.title}
                    </a>
                </p>
            </div>
            <div class="col-3">
                <p class="text-truncate border bg-body border-primary mb-1 py-1 px-3 rounded-2 text-center">
                    {post.author}
                </p>
            </div>
            <div class="col-2">
                <p class="border bg-body border-primary mb-1 py-1 px-3 rounded-2 text-center text-gray">
                    {post.created.toLocaleDateString("en-AU")}
                </p>
            </div>
        </div>
    )

    return (
        <div class="container bd-blue-4t rounded-5 px-0">
            <div class="row text-center py-3 align-items-center">
                <div class="col-4"> </div>
                <div class="col-4">
                    <h2>Forum Posts</h2>
                </div>

                <CreateButton />
            </div>

            <div class="container-sm p-3 bd-blue-1t border border-body rounded-5">
                <div class="row">
                    <div class="col-7">
                        <p class="text-truncate border bg-body border-primary my-1 py-2 rounded-3 text-center">
                            <b>Title</b>
                        </p>
                    </div>
                    <div class="col-3">
                        <p class="text-truncate border bg-body border-primary my-1 py-2 rounded-3 text-center">
                            <b>Author</b>
                        </p>
                    </div>
                    <div class="col-2">
                        <p class="border bg-body border-primary my-1 py-2 rounded-3 text-center">
                            <b>Date</b>
                        </p>
                    </div>
                </div>

                <div class="my-3">
                    {listPosts}
                </div>

                <div class="row justify-content-end">
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col row justify-content-around">
                        <div class="col">
                            <button class="btn btn-primary" onClick={() => setPage(Math.max(1, curPage - 1))}>Previous</button>
                        </div>
                        <div class="col">
                            <button class="btn btn-primary" onClick={() => setPage(Math.min(lastPage, curPage + 1))}>Next</button>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default function HomePage() {
    return (
        <div class="py-5"><Posts /></div>
    )
}