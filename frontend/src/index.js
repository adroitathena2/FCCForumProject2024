import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Root from './root';
import ErrorPage from "./error-page";

import ForumPage from './pages/ForumPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <ForumPage/>
            },
            {
                path: "login",
                element: <LoginPage/>
            },
            {
                path: "signup",
                element: <SignUpPage/>
            },
            {
                path: "createpost",
                element: <CreatePostPage/>
            },
            {
                path: "post",
                element: <PostPage/>
            }
        ]
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);