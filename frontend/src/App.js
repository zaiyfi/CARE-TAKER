// React/Redux Hooks and React Router
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Gigs";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Admin from "./pages/admin/Admin";
import Page404 from "./pages/Page404";
import ProductDetails from "./pages/ProductDetails";
import UserData from "./pages/UserData";
import ContactAdmin from "./pages/ContactAdmin";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Components
import Navbar from "./components/Navbar";
import LoaderSpinner from "./components/loaderSpinner";
import ProtectedAdminRoute from "./components/Others/ProtectedAdminRoute";
import ChatWindow from "./components/Chat/ChatWindow";
import ProtectedLogin from "./components/Others/ProtectedLogin";
import FloatingChatList from "./components/Chat/FloatingChatList";
import UnprotectedRoute from "./components/Others/UnprotectedRoute";

// Redux Store
import store from "./redux/store";
import { setLoader } from "./redux/loaderSlice";

// Map
import "leaflet/dist/leaflet.css";
import NearMeMap from "./pages/NearMeMap";

// Socket.io client
import socket from "./socket";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <div className="App bg-gray-100 min-h-screen">
        {loading && <LoaderSpinner />}
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path={"/gigs"}
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
            path="/gigs/near-me"
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
          <Route path="/contact-admin" element={<ContactAdmin />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
        {auth?.user?._id && <FloatingChatList />}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;
