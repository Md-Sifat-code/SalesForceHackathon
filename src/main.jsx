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
import Home from "./Pages/Home";
import Error from "./Error/Error";
import Main_Layout from "./Layout/Main_Layout";
import Rooms from "./Pages/Rooms";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth_Layout/>,
    errorElement : <Error/>,
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
  {
    path : "/home",
    element : <Main_Layout/>,
    errorElement : <Error/>,
    children : [
      {
        path : "/home",
        element : <Home/>
      },
      {
        path : "/home/rooms",
        element : <Rooms/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
