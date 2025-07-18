// React/Redux Hooks and React Router
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
function App() {
  // Getting the state of loader
  const { loading } = useSelector((state) => state.loader);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoader(false));
    try {
      console.log(store.getState());
    } catch (error) {
      console.log("User is not Logged in!");
    }
  }, []);

  // Routing
  return (
    <BrowserRouter>
      <div className="App">
        {loading && <LoaderSpinner />}
        <Navbar />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/product/:productId"} element={<ProductDetails />} />
          <Route path="/near-me" element={<NearMeMap />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedUserRoute>
                <Profile />
              </ProtectedUserRoute>
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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
