import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Signin from "./auth/authcomponent/Signin";
import Auth_Layout from "./Layout/Auth_Layout";
import Login from "./auth/authcomponent/Login";
import Verification from "./auth/authcomponent/Verification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth_Layout/>,
    children : [
      {
        path : "/",
        element : <Signin/>
      },
      {
        path : "/verify",
        element : <Verification/>

      },
      {
        path : "/login",
        element : <Login/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
