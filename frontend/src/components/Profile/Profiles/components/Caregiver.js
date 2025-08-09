import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import VerificationForm from "./VerificationForm";
import {
  fetchCityNameAndUpdate,
  fetchVerificationInfo,
} from "../../../../lib/helpers/caregiverHelpers";

// Toast notifications
import "react-toastify/dist/ReactToastify.css";

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
    if (user?.location?.coordinates && token) {
      const [lng, lat] = user.location.coordinates;

      fetchCityNameAndUpdate(lat, lng, user._id, token, dispatch).then(
        (city) => {
          setCityName(city); // Optional local state
        }
      );
    }
  }, [user.location, token, user._id, dispatch]);

  useEffect(() => {
    if (!user.verificationInfo) {
      fetchVerificationInfo(token, dispatch);
    }
  }, [token]);

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
              <p className="text-sm">No ID provided yet.</p>
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
