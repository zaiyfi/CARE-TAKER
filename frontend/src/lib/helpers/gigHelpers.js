// helpers/gigHelpers.js
import { toast } from "react-toastify";
import { setLoader } from "../../redux/loaderSlice";
import { setUserGigs } from "../../redux/userGigSlice";
import { addGig, deleteGig } from "../../redux/gigSlice";

// Fetch user gigs
export const fetchUserGigsHelper = async (dispatch, token) => {
  try {
    dispatch(setLoader(true));

    const response = await fetch("/api/gigs/user-gigs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    console.log("Fetched user gigs...", json);
    if (response.ok) {
      dispatch(setUserGigs(json));
      dispatch(setLoader(false));
      toast.success("Your Application fetched successfully!");
    }

    if (!response.ok) {
      toast.error(json.message || "Failed to fetch gigs.");
      dispatch(setLoader(false));
      return;
    }
  } catch (error) {
    toast.error("An error occurred while fetching gigs.");
    dispatch(setLoader(false));
  }
};

// Submit new gig application
export const submitGigHelper = async (dispatch, token, formData) => {
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
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const json = await response.json();

    if (!response.ok) {
      toast.error(json.message || "Failed to submit application.");
      dispatch(setLoader(false));
      return;
    }

    dispatch(addGig(json));
    dispatch(setUserGigs([json]));
    toast.success("Form submitted successfully!");
    dispatch(setLoader(false));
  } catch (error) {
    toast.error("An error occurred while submitting the application.");
    dispatch(setLoader(false));
  }
};

// Delete a gig
export const deleteGigHelper = async (dispatch, token, gigId) => {
  try {
    dispatch(setLoader(true));
    const response = await fetch(`/api/gigs/delete/${gigId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      toast.error("Failed to delete gig.");
      dispatch(setLoader(false));
      return;
    }

    dispatch(setUserGigs([]));
    dispatch(deleteGig(gigId));
    toast.success("Gig deleted successfully.");
    dispatch(setLoader(false));
  } catch (error) {
    toast.error("An error occurred while deleting the gig.");
    dispatch(setLoader(false));
  }
};
