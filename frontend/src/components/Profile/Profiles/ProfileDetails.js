import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserGigs } from "../../../redux/userGigSlice"; // updated import
import store from "../../../redux/store";
import UserImgUpload from "./UserImgUpload";
import Caregiver from "./components/Caregiver";
import Clients from "./components/Clients";
import { MdVerifiedUser } from "react-icons/md";

const ProfileDetails = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { userGigs } = useSelector((state) => state.userGigs); // updated state
  const [gigLength, setGigLength] = useState("");

  const isLoggedIn = auth.user._id;

  // Fetching the userGigs
  useEffect(() => {
    // fetching the gigs only if the userGigs are empty
    if (!userGigs?.length > 0) {
      const fetchGigs = async () => {
        try {
          const response = await fetch("/api/gigs/user-gigs", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          const json = await response.json();
          if (!response.ok) {
            console.log("response is not ok");
          }
          if (response.ok) {
            dispatch(setUserGigs(json));
            console.log(store.getState());
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchGigs();
    }
  }, [dispatch, auth.token, auth.user._id]);

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between py-4 px-4 sm:px-6 lg:px-8">
      {/* Profile Picture */}
      <div className="flex flex-col items-center md:w-1/4">
        <div className="mb-4">
          <img
            src={auth.user.pic}
            alt={auth.user.name}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-primary"
          />
        </div>
        {isLoggedIn && <UserImgUpload auth={auth} />}
      </div>

      {/* Profile Info */}
      <div className="flex-1 mt-6 md:mt-0 md:pl-8 w-full">
        <div className="border-b-2 pb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            {auth.user.name}
            {auth.user.verificationStatus === "Approved" && (
              <MdVerifiedUser
                title="Verified"
                className="text-green-600 text-xl sm:text-2xl"
              />
            )}
          </h2>
          <h2 className="text-sm sm:text-base font-normal text-gray-600">
            {auth.user.email}
          </h2>
        </div>

        {/* Conditional Render */}
        {auth.user.role === "Caregiver" ? (
          <Caregiver auth={auth} userGigs={userGigs} />
        ) : (
          <Clients />
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
