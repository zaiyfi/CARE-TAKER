import { useEffect, useState } from "react";
import { setUserCity } from "../../../../redux/authSlice";
import { useDispatch } from "react-redux";
import store from "../../../../redux/store";

const Caregiver = ({ auth, userGigs }) => {
  const dispatch = useDispatch();

  const [cityName, setCityName] = useState("");
  const gigCategory =
    userGigs?.length > 0 ? userGigs[0].category : "No Category";
  const user = auth.user;
  const token = auth.token;

  useEffect(() => {
    const fetchCityNameAndUpdate = async () => {
      if (
        user?.location?.coordinates?.length === 2 &&
        !user.city // only fetch if city is missing
      ) {
        const [lng, lat] = user.location.coordinates;

        try {
          console.log("Fetching city name from coordinates:", lat, lng);
          // Get city from coordinates
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

          setCityName(city); // show on UI immediately

          // Send city to backend to save in user document
          const updateRes = await fetch(`/api/auth/update/${user._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ city }),
          });
          const updateData = await updateRes.json();
          if (updateRes.ok) {
            console.log("City updated successfully in user document");
            dispatch(setUserCity(city)); // update the userGigs in Redux store
            console.log(store.getState());
            return console.log(updateData);
          }

          if (!updateRes.ok) {
            console.error("Failed to update city in user document");
          }
        } catch (err) {
          console.error("Reverse geocoding or update failed", err);
          setCityName("Unknown");
        }
      } else if (user.city) {
        setCityName(user.city); // already exists in DB
      }
    };

    fetchCityNameAndUpdate();
  }, []);

  const openVerificationModal = () => {};

  return (
    <div>
      {user.role === "Caregiver" && (
        <div className="mt-6 space-y-4 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold">ID Card</h3>
            <p className="text-sm mt-1">
              {user.about || "No ID provided yet."}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{gigCategory} Certificate</h3>
            <p className="text-sm mt-1">
              {user.skills?.join(", ") || "No Certificate provided yet."}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Location</h3>
            <p className="text-sm mt-1">{user.city || "Not specified"}</p>
          </div>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded mb-4">
            <p className="text-sm">
              Get verified to build trust and increase your chances of getting
              hired.
            </p>
            <button
              className="mt-2 px-3 py-1 text-sm bg-secondary hover:bg-lightPrimary text-white rounded"
              onClick={openVerificationModal}
            >
              Verify Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caregiver;
