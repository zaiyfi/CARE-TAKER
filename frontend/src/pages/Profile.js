import { useState } from "react";
// React Icons
import { GrStatusGood } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";

// Custom hook and component
import useAddProduct from "../hooks/useAddProduct";
import Products from "../components/Profile/Product/Products";
import ProfileDetails from "../components/Profile/Profiles/ProfileDetails";
import { useSelector } from "react-redux";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { auth } = useSelector((state) => state.auth);
  const { gigs } = useSelector((state) => state.gigs);
  const { product } = useAddProduct();

  return (
    <div className="flex flex-col md:flex-row my-4 select-none">
      {product && (
        <div className="flex border-2 border-green-500 bg-white p-2 rounded">
          <GrStatusGood className="text-green-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">Product added successfully!</p>
        </div>
      )}

      <div className="tab border-b mx-auto w-2/3 flex flex-row md:flex-col md:border-b-0 md:border-e md:w-[15%]">
        <div
          className={`links mx-auto w-full ${activeTab === 1 ? "activeB" : ""}`}
          onClick={() => setActiveTab(1)}
        >
          <FaUser className="icons" />
          <button className="tablinks">Profile</button>
        </div>

        {auth?.user?.role === "Caregiver" && (
          <div
            className={`links ${activeTab === 2 ? "activeB" : ""}`}
            onClick={() => setActiveTab(2)}
          >
            <PiPackageFill className="icons" />
            <button className="tablinks">Application</button>
          </div>
        )}
      </div>

      {activeTab === 1 && (
        <ProfileDetails user={auth.user} products={gigs} token={auth.token} />
      )}
      {activeTab === 2 && <Products />}
    </div>
  );
};

export default Profile;
