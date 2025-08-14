import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CaregiverApplicationForm from "./CaregiverApplicationForm";
import {
  deleteGigHelper,
  fetchUserGigsHelper,
  submitGigHelper,
} from "../../../lib/helpers/gigHelpers";

const GigForm = () => {
  const { auth } = useSelector((state) => state.auth);
  const { userGigs } = useSelector((state) => state.userGigs);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    experience: "",
    description: "",
    category: "",
    cv: null,
    image: null,
    imageURL: "",
    availability: [],
  });

  const categories = ["Pets", "Children", "Elders", "Disabled"];

  useEffect(() => {
    if (!userGigs?.length > 0) {
      fetchUserGigsHelper(dispatch, auth.token);
    }
  }, [dispatch, auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 10) return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    if (!file) return;

    setFormData((prev) => {
      const updated = { ...prev };
      if (fieldName === "image") {
        updated.image = file;
        updated.imageURL = URL.createObjectURL(file);
      } else if (fieldName === "cv") {
        updated.cv = file;
        updated.cvURL = URL.createObjectURL(file);
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const wordCount = formData.title.trim().split(/\s+/).length;
    if (wordCount < 4 || wordCount > 10) return;
    submitGigHelper(dispatch, auth.token, formData);
  };

  const handleDeleteGig = (gigId) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      deleteGigHelper(dispatch, auth.token, gigId);
    }
  };

  return (
    <>
      {userGigs.length > 0 ? (
        // Existing Gig display
        <div className="w-full md:w-4/5 mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Your Existing Gig
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>
                <span className="font-semibold text-gray-600">Title:</span>{" "}
                {userGigs[0].name}
              </p>
              <p>
                <span className="font-semibold text-gray-600">Category:</span>{" "}
                {userGigs[0].category}
              </p>
              <p>
                <span className="font-semibold text-gray-600">
                  Appointment Price:
                </span>{" "}
                {userGigs[0].hourlyRate}PKR
              </p>
              <p>
                <span className="font-semibold text-gray-600">Experience:</span>{" "}
                {userGigs[0].experience}
              </p>
              <p>
                <span className="font-semibold text-gray-600">
                  Description:
                </span>{" "}
                {userGigs[0].description}
              </p>

              {userGigs[0].cv && (
                <p>
                  <span className=" font-semibold text-gray-600">CV:</span>{" "}
                  <a
                    href={userGigs[0].cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View CV
                  </a>
                </p>
              )}

              {userGigs[0].availability &&
                userGigs[0].availability.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-600 mb-1">
                      Availability:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {userGigs[0].availability.map((slot, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full border border-green-300"
                        >
                          {slot.day}{" "}
                          {slot.fullDay
                            ? "Available All Day"
                            : `${slot.startTime} - ${slot.endTime}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {userGigs[0].image && (
              <div className="flex justify-center md:justify-end">
                <img
                  src={userGigs[0].image}
                  alt="Gig Image"
                  className="w-40 h-40 rounded-xl object-cover border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleDeleteGig(userGigs[0]._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition duration-200"
            >
              Delete Gig
            </button>
          </div>
        </div>
      ) : (
        // Caregiver form component
        <CaregiverApplicationForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          categories={categories}
          handleFileChange={handleFileChange}
          handleChange={handleChange}
        />
      )}
    </>
  );
};

export default GigForm;
