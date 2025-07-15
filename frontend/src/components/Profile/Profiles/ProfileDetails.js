import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserGigs } from "../../../redux/userGigSlice"; // updated import
import store from "../../../redux/store";
import UserImgUpload from "./UserImgUpload";
import FavProducts from "../Product/FavProducts"; // renamed from FavProducts
import UserProducts from "./UserProducts"; // renamed from UserProducts

const ProfileDetails = ({ user, token, gigs }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { userGigs } = useSelector((state) => state.userGigs); // updated state
  const [gigLength, setGigLength] = useState("");

  const isLoggedIn = auth.user === user._id;

  // Fetching the userGigs
  useEffect(() => {
    if (user._id === auth.user._id && !userGigs?.length > 0) {
      const fetchGigs = async () => {
        try {
          const response = await fetch("/api/gigs/user-gigs", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [dispatch, token, auth.user._id, user._id]);

  return (
    <div className="w-[90%] mx-auto md:w-[75%] flex justify-between md:mx-[5%] py-4">
      <div className="w-[17%]">
        <div className="round-img mb-6">
          <img
            src={user.pic}
            alt=""
            className="w-[200px] h-[200px] rounded-full mb-2"
          />
          {isLoggedIn && <UserImgUpload auth={auth} />}
        </div>

        <h2 className="w-full text-lg font-medium border-b-2 border-black text-center">
          {isLoggedIn
            ? `${gigLength} Saved Gigs`
            : `${gigLength} Published Gigs`}
        </h2>
      </div>
      <div className="w-[73%]">
        <div className="border-b-2 pb-10">
          <h2 className="text-4xl font-semibold w-full">{user.name}</h2>
          <h2 className="text-base font-normal">{user.email}</h2>
        </div>
        {isLoggedIn ? (
          <FavProducts
            gigs={gigs}
            user={user}
            token={token}
            gigLength={(s) => setGigLength(s)}
          />
        ) : (
          <UserProducts
            user={user}
            token={token}
            products={gigs}
            productLength={(s) => setGigLength(s)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
