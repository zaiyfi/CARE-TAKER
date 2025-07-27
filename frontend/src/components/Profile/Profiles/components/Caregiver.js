import { useEffect, useState } from "react";
import { setUserCity, setVerificationInfo } from "../../../../redux/authSlice";
import { useDispatch } from "react-redux";
import store from "../../../../redux/store";
import VerificationForm from "./VerificationForm";

const Caregiver = ({ auth, userGigs }) => {
  const dispatch = useDispatch();

  const [cityName, setCityName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleEdit = () => {
    setEditingData(user.verificationInfo);
    setEditMode(true);
    setShowModal(true);
  };

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

    const fetchVerificationInfo = async () => {
      try {
        const res = await fetch("/api/verify/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          console.log("Verification data fetched successfully:", data);
          dispatch(setVerificationInfo(data));
          console.log(store.getState());
        } else {
          console.warn("No verification data found.");
        }
      } catch (err) {
        console.error("Error fetching verification info", err);
      }
    };

    if (user.role === "Caregiver" && !user.verificationInfo) {
      fetchVerificationInfo();
    }

    fetchCityNameAndUpdate();
  }, []);

  const openVerificationModal = () => {
    setShowModal(true);
  };

  return (
    <div>
      <div className="mt-6 space-y-4 text-gray-700">
        <div>
          <h3 className="text-xl font-semibold">ID Card</h3>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            {user.verificationInfo?.cnicFront ? (
              <img
                src={user.verificationInfo.cnicFront}
                alt="CNIC Front"
                className="w-32 h-20 object-cover rounded"
              />
            ) : (
              <p className="text-sm">No ID Card provided yet.</p>
            )}
            {user.verificationInfo?.cnicBack ? (
              <img
                src={user.verificationInfo.cnicBack}
                alt="CNIC Back"
                className="w-32 h-20 object-cover rounded"
              />
            ) : (
              <p className="text-sm">No ID Card provided yet.</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Selfie with CNIC</h3>
          {user.verificationInfo?.selfieWithCnic ? (
            <img
              src={user.verificationInfo.selfieWithCnic}
              alt="selfie with CNIC"
              className="w-32 h-20 object-cover rounded"
            />
          ) : (
            <p className="text-sm">No Selfie provided yet.</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{gigCategory} Certificate</h3>
          <p className="text-sm mt-1">
            {user.skills?.join(", ") || "No Certificate provided yet."}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Verification Status</h3>
          <p className="text-sm mt-1">
            <span className=" font-medium">
              {user.verificationStatus + "!" || "Not Verified!"}
            </span>{" "}
            {user.verificationStatus === "Pending"
              ? "Waiting for admin approval."
              : user.verificationStatus === "Rejected"
              ? "Please resubmit your documents."
              : "Congratulations. You are verified!"}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Location</h3>
          <p className="text-sm mt-1">{user.city || "Not specified"}</p>
        </div>

        {!user.verificationInfo && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded mb-4">
            <p className="text-sm">
              Get verified to build trust and increase your chances of getting
              hired.
            </p>
            <button
              className="mt-2 px-3 py-1 text-sm bg-primary hover:bg-lightPrimary text-white rounded"
              onClick={openVerificationModal}
            >
              Verify Now
            </button>
          </div>
        )}
        {user.verificationInfo && (
          <button
            onClick={handleEdit}
            className="mt-3 px-3 py-1 text-sm bg-primary hover:bg-lightPrimary  text-white rounded"
          >
            Edit Verification
          </button>
        )}
        {showModal && (
          <VerificationForm
            token={token}
            onClose={() => {
              setShowModal(false);
              setEditMode(false);
              setEditingData(null);
            }}
            dispatch={dispatch}
            isEdit={editMode}
            existingData={editingData}
          />
        )}
      </div>
    </div>
  );
};

export default Caregiver;
