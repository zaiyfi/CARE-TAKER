// lib/helpers/caregiverHelpers.js
import { toast } from "react-toastify";
import { setUserCity, setVerificationInfo } from "../../redux/authSlice";

export const fetchCityNameAndUpdate = async (
  lat,
  lng,
  userId,
  token,
  dispatch
) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();

    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state ||
      "Unknown";

    const updateRes = await fetch(`/api/auth/update/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ city }),
    });

    const updateData = await updateRes.json();

    if (updateRes.ok) {
      dispatch(setUserCity(city));
      return city;
    } else {
      return "Unknown";
    }
  } catch (err) {
    console.error("Error in city fetch/update:", err);
    toast.error("Error fetching city from location");
    return "Unknown";
  }
};

export const fetchVerificationInfo = async (token, dispatch) => {
  try {
    const res = await fetch("/api/verify/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(setVerificationInfo(data));
    }
  } catch (err) {
    console.error("Error fetching verification info:", err);
    toast.error("Failed to load verification info");
  }
};
