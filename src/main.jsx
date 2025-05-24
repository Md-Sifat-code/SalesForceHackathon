// Polyfill for `global` and `process` for sockjs-client and related libs
if (typeof global === "undefined") {
  window.global = window;
}

if (typeof process === "undefined") {
  window.process = {
    env: { NODE_ENV: "development" },
  };
}

// Buffer polyfill for some libs that need it
import { Buffer } from "buffer";
if (!window.Buffer) {
  window.Buffer = Buffer;
}

// Now your other imports
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

import { UserProvider } from "./context/UserContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import Messege_Layout from "./Layout/Messege_Layout";
import Messages from "./components/Messeges";
import About from "./Pages/About";
import Equipments from "./Pages/Equipments";
import ManagementDashboard from "./components/ManagementDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth_Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Signin />,
      },
      {
        path: "/verify",
        element: <Verification />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/home",
    element: <Main_Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/home/rooms",
        element: <Rooms />,
      },
      {
        path: "/home/chat",
        element: <Messege_Layout/>,
        children: [{ path: "/home/chat", element: <Messages /> }],
      },
      {
        path: "/home/about",
        element: <About />,
      },
      {
        path: "/home/equipments",
        element: <Equipments />,
      },
      {
        path: "/home/management",
        element: <ManagementDashboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <WebSocketProvider>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </UserProvider>
  </React.StrictMode>
);
