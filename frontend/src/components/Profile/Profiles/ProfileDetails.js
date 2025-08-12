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
    <div className="w-[90%] mx-auto md:w-[75%] flex justify-between md:mx-[5%] py-4">
      <div className="w-[17%]">
        <div className="round-img mb-6">
          <img
            src={auth.user.pic}
            alt=""
            className="w-[200px] h-[200px] rounded-full mb-2"
          />
          {isLoggedIn && <UserImgUpload auth={auth} />}
        </div>
      </div>
      <div className="w-[73%]">
        <div className="border-b-2 pb-10">
          <h2 className="text-4xl font-semibold w-full">
            {auth.user.name}{" "}
            {auth.user.verificationStatus === "Approved" && (
              <span className="text-green-600 inline-block align-middle">
                <MdVerifiedUser title="Verified" className="inline text-2xl" />
              </span>
            )}
          </h2>
          <h2 className="text-base font-normal">{auth.user.email}</h2>
        </div>
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
