import { useEffect, useState } from "react";
import citiesData from "../../../other/cities.json";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/loaderSlice";
import store from "../../../redux/store";
import { setUserGigs } from "../../../redux/userGigSlice";
import { addGig, deleteGig } from "../../../redux/gigSlice";

const GigForm = () => {
  // Redux
  const { auth } = useSelector((state) => state.auth);
  const { userGigs } = useSelector((state) => state.userGigs);

  const dispatch = useDispatch();

  // const [selectedTab, setSelectedTab] = useState("1");
  const [error, setError] = useState(null);

  // GET Application related to this user
  useEffect(() => {
    dispatch(setLoader(false));

    if (!userGigs?.length > 0) {
      const fetchUserGigs = async () => {
        dispatch(setLoader(true));
        console.log("Loader set to true");

        const response = await fetch("/api/gigs/user-gigs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`, // added token to headers
          },
        });
        const json = await response.json();

        if (!response.ok) {
          console.log("response is not ok");
          dispatch(setLoader(false));
        }

        if (response.ok) {
          console.log(json);
          dispatch(setUserGigs(json));
          dispatch(setLoader(false));
          console.log("Loader set to false");

          console.log(store.getState());
        }
      };

      fetchUserGigs();
    }
  }, [dispatch, auth]);

  // Handling Create Form
  const sendApplication = async () => {
    try {
      dispatch(setLoader(true));

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("hourlyRate", formData.price);
      formDataToSend.append("experience", formData.experience);
      if (formData.cv) formDataToSend.append("cv", formData.cv);
      if (formData.image) formDataToSend.append("image", formData.image);
      formDataToSend.append(
        "availability",
        JSON.stringify(formData.availability)
      );

      const response = await fetch("/api/gigs/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`, // 🚨 Do NOT set 'Content-Type'
        },
        body: formDataToSend,
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      if (response.ok) {
        dispatch(addGig(json));
        dispatch(setUserGigs([json])); // wrap it in an array
        dispatch(setLoader(false));
        console.log(store.getState());
      }
      alert("Form Submitted successfully");
    } catch (error) {
      setError(error.message);
      dispatch(setLoader(false));
    }
  };

  // // Calling the PATCH Api         EDITING THE FORM
  // const EditProduct = async (values) => {
  //   try {
  //     dispatch(setLoader(true));
  //     const response = await fetch(`/api/products/${productId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${auth.token}`,
  //       },
  //       body: JSON.stringify(values),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to add product");
  //     }
  //     const json = await response.json();
  //     if (response.ok) {
  //       dispatch(updateUserProduct({ updatedProduct: json }));
  //       dispatch(updateProduct({ updatedProduct: json }));
  //     }
  //     dispatch(setLoader(false));
  //     setEditForm(false);
  //     setShowProductForm(false);
  //   } catch (error) {
  //     dispatch(setLoader(false));
  //   }
  // };

  const [err, setErr] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      const wordCount = value.trim().split(/\s+/).length;

      // Ensure at least 4 words and at most 10 words
      if (wordCount > 10) return; // Prevent typing more than 10 words
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageURL: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const wordCount = formData.title.trim().split(/\s+/).length;

    // Check if title meets the word limit
    if (wordCount < 4 || wordCount > 10) {
      return; // Stop form submission
    }
    console.log("Form Data Submitted:", formData);
    // setFormData({
    //   title: "",
    //   city: "",
    //   price: "",
    //   experience: "",
    //   description: "",
    //   cv: null,
    //   image: null,
    //   cvURL: null,
    //   imageURL: null,
    // });
    sendApplication();
  };
  const handleDeleteGig = async (gigId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this gig?"
    );
    if (!confirmDelete) return;

    try {
      dispatch(setLoader(true));
      const response = await fetch(`/api/gigs/delete/${gigId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete gig");
      }

      dispatch(setUserGigs([])); // Clear gigs in Redux
      dispatch(deleteGig(gigId));
      dispatch(setLoader(false));
      alert("Gig deleted successfully.");
    } catch (error) {
      console.error(error.message);
      dispatch(setLoader(false));
    }
  };

  const categories = ["Pets", "Children", "Elders", "Disabled"];

  return (
    <>
      {userGigs.length > 0 ? (
        <div className="w-full md:w-5/6 mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Existing Gig</h2>

          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {userGigs[0].name}
            </p>
            <p>
              <strong>Category:</strong> {userGigs[0].category}
            </p>

            <p>
              <strong>Hourly Rate:</strong> {userGigs[0].hourlyRate}
            </p>
            <p>
              <strong>Experience:</strong> {userGigs[0].experience}
            </p>
            <p>
              <strong>Description:</strong> {userGigs[0].description}
            </p>
            {/* Optional image preview */}
            {userGigs[0].image && (
              <img
                src={userGigs[0].image}
                alt="Gig Image"
                className="w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          <button
            onClick={() => handleDeleteGig(userGigs[0]._id)}
            className="mt-4 bg-primary text-white p-2 rounded hover:bg-lightPrimary transition-all"
          >
            Delete Gig
          </button>
        </div>
      ) : (
        <div className="w-full md:w-5/6 mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Caregiver Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className=" grid md:grid-cols-2 gap-4 gap-y-6">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Title: Specialist for Dog Care"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded outline-primary"
                  required
                />
                {formData.title.trim().split(/\s+/).length < 4 && (
                  <p className="absolute text-red-500 text-sm">
                    Title must have at least 4 words
                  </p>
                )}
              </div>

              {/*                         Categories            */}
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className=" border-2 p-2 rounded-md outline-primary "
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="price"
                placeholder="Hourly Rate (RS)"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded outline-primary"
                required
              />

              <input
                type="text"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2 border rounded outline-primary"
                required
              />
            </div>

            <textarea
              name="description"
              placeholder="Describe your skills & experience"
              value={formData.description}
              onChange={handleChange}
              className="w-full min-h-fit max-h-80 p-2 border rounded outline-primary"
              rows="3"
              required
            ></textarea>
            {/* CV       UPLOAD */}
            <div>
              <label for="cv">CV</label>
              <input
                type="file"
                name="cv"
                id="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full p-2 border rounded outline-primary"
                required
              />
              {formData.cv && (
                <p className="mt-2">
                  📄{" "}
                  <a
                    href={formData.cvURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {formData.cv.name}
                  </a>
                </p>
              )}
            </div>

            {/* IMAGE        UPLOAD */}
            <div>
              <label for="image">Image</label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded outline-primary"
                required
              />
              {formData.image && (
                <img
                  src={formData.imageURL}
                  alt="Uploaded Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg border"
                />
              )}
            </div>

            {/*    Availability Info   */}
            <div className="my-4">
              <h3 className="text-md font-semibold mb-2">Availability</h3>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="mb-2 flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData((prev) => {
                        let updated = [...prev.availability];
                        if (isChecked) {
                          updated.push({ day, startTime: "", endTime: "" });
                        } else {
                          updated = updated.filter((item) => item.day !== day);
                        }
                        return { ...prev, availability: updated };
                      });
                    }}
                  />
                  <label htmlFor={`day-${day}`} className="w-24">
                    {day}
                  </label>
                  <input
                    type="time"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        availability: prev.availability.map((slot) =>
                          slot.day === day
                            ? { ...slot, startTime: e.target.value }
                            : slot
                        ),
                      }));
                    }}
                    className="border px-2 py-1 rounded"
                    disabled={!formData.availability.find((a) => a.day === day)}
                  />
                  <input
                    type="time"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        availability: prev.availability.map((slot) =>
                          slot.day === day
                            ? { ...slot, endTime: e.target.value }
                            : slot
                        ),
                      }));
                    }}
                    className="border px-2 py-1 rounded"
                    disabled={!formData.availability.find((a) => a.day === day)}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded hover:bg-lightPrimary transition-all"
            >
              Submit Application
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default GigForm;
