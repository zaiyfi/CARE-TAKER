// React/Redux Hooks and React Router
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Components
import Navbar from "./components/Navbar";
import LoaderSpinner from "./components/loaderSpinner";
import ProtectedUserRoute from "./components/Others/ProtectedUserRoute";
import ProtectedAdminRoute from "./components/Others/ProtectedAdminRoute";
import ChatWindow from "./components/Chat/ChatWindow";

// Redux Store
import store from "./redux/store";
import Admin from "./pages/admin/Admin";
import Page404 from "./pages/Page404";
import ProductDetails from "./pages/ProductDetails";
import ProtectedLogin from "./components/Others/ProtectedLogin";
import UserData from "./pages/UserData";
import { setLoader } from "./redux/loaderSlice";

import "leaflet/dist/leaflet.css";
import NearMeMap from "./pages/NearMeMap";
import FloatingChatList from "./components/Chat/FloatingChatList";
import UnprotectedRoute from "./components/Others/UnprotectedRoute";

// Socket.io client
import socket from "./socket";
import HomePage from "./pages/HomePage";

function App() {
  // Getting the state of loader
  const { loading } = useSelector((state) => state.loader);
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth?.user?._id) {
      socket.connect();
      socket.emit("join-chat", { userId: auth.user._id });
    }

    dispatch(setLoader(false));
    console.log(store.getState());

    return () => {
      socket.disconnect(); // important cleanup
    };
  }, [auth?.user?._id]);

  // Routing
  return (
    <BrowserRouter>
      <div className="App">
        {loading && <LoaderSpinner />}
        <Navbar />
        <Routes>
          <Route path="/home" element={<HomePage />} />

          <Route
            path={"/"}
            element={
              <ProtectedLogin>
                <Home />
              </ProtectedLogin>
            }
          />
          <Route
            path={"/product/:productId"}
            element={
              <ProtectedLogin>
                <ProductDetails />
              </ProtectedLogin>
            }
          />
          <Route
            path="/near-me"
            element={
              <ProtectedLogin>
                <NearMeMap />
              </ProtectedLogin>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedLogin>
                <Profile />
              </ProtectedLogin>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/seller/profile/:userId"
            element={
              <ProtectedLogin>
                <UserData />{" "}
              </ProtectedLogin>
            }
          />
          <Route path="/chat" element={<ChatWindow />} />
          {/* Sign in/up Routes */}
          <Route
            path="/register"
            element={
              <UnprotectedRoute>
                <Register />
              </UnprotectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <UnprotectedRoute>
                <Login />
              </UnprotectedRoute>
            }
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
        <ProtectedLogin>
          <FloatingChatList />
        </ProtectedLogin>
      </div>
    </BrowserRouter>
  );
}

export default App;
