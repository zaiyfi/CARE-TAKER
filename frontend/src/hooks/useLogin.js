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
        navigate("/");
        dispatch(setUser(json));
        dispatch(setNotif("logged in success"));
        console.log(store.getState());
      }
    } catch (error) {
      console.error("An error occurred:", error);
      dispatch(setLoader(false));
      setError("An error occurred while logging in.");
    }
  };
  return { loginHook, error };
};
