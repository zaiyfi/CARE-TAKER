import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice";
import { setLoader } from "../redux/loaderSlice";
import store from "../redux/store";
import { setNotif } from "../redux/notifSlice";
export const useLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const loginHook = async (email, password) => {
    try {
      dispatch(setLoader(true));
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();

      if (!response.ok) {
        dispatch(setLoader(false));
        setError(json.error);
      } else {
        dispatch(setLoader(false));
        dispatch(setUser(json));
        dispatch(setNotif("logged in success"));
        navigate("/gigs");

        console.log(store.getState());

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            // ✅ Send to backend
            const response = await fetch(
              `/api/auth/${json.user._id}/location`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  // Optional: 'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(coords),
              }
            );
            const res = await response.json();

            console.log("Location updated");
            console.log(res);
            // 🔁 Redirect or fetch user data here
          },
          (error) => {
            console.error("Location access denied", error);
            // Proceed even without location
          }
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      dispatch(setLoader(false));
      setError("An error occurred while logging in.");
    }
  };
  return { loginHook, error };
};
