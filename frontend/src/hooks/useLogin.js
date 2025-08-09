import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice";
import { setLoader } from "../redux/loaderSlice";
import store from "../redux/store";
import { setNotif } from "../redux/notifSlice";
import { toast } from "react-toastify";

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
        const msg = json.error || "Invalid credentials";
        setError(msg);
        toast.error(msg);
        dispatch(setLoader(false));
        return;
      }

      dispatch(setLoader(false));
      dispatch(setUser(json));
      dispatch(setNotif("logged in success"));
      toast.success("Login successful!");
      navigate("/gigs");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const response = await fetch(`/api/auth/${json.user._id}/location`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(coords),
          });

          const res = await response.json();
          console.log("Location updated", res);
        },
        (error) => {
          console.warn("Location access denied", error);
          toast.info(
            "Location access was denied. Continuing without location."
          );
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in.");
      toast.error("An error occurred while logging in.");
      dispatch(setLoader(false));
    }
  };

  return { loginHook, error };
};
