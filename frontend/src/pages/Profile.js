import { useState } from "react";
import { GrStatusGood } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";
import { MdEventNote } from "react-icons/md";
import useAddProduct from "../hooks/useAddProduct";
import Products from "../components/Profile/Product/Products";
import ProfileDetails from "../components/Profile/Profiles/ProfileDetails";
import { useSelector } from "react-redux";
import Appointments from "../components/Profile/Appointments/Appointments";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { auth } = useSelector((state) => state.auth);
  const { gigs } = useSelector((state) => state.gigs);
  const { product } = useAddProduct();

  return (
    <div className="flex flex-col md:flex-row my-4 select-none">
      {product && (
        <div className="flex border-2 border-primary bg-lightPrimary p-2 rounded mb-4 mx-4 md:mx-0">
          <GrStatusGood className="text-primary mx-1 text-lg mt-0.5" />
          <p className="text-black text-sm md:text-base">
            Product added successfully!
          </p>
        </div>
      )}

      {/* Sidebar / Tab Menu */}
      <div className="flex md:flex-col w-full md:w-[10%] md:h-[80vh] bg-white border-b md:border-b-0 md:border-r shadow-sm">
        {[
          { id: 1, icon: FaUser, label: "Profile" },
          ...(auth?.user?.role === "Caregiver"
            ? [{ id: 2, icon: PiPackageFill, label: "Application" }]
            : []),
          { id: 3, icon: MdEventNote, label: "Appointments" },
        ].map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`flex-1 flex flex-col items-center gap-1 py-3 cursor-pointer transition-all
        ${
          activeTab === id
            ? "bg-lightPrimary text-primary font-semibold border-l-4 border-primary md:border-l-0 md:border-t-4 shadow-inner"
            : "hover:bg-lightPrimary text-gray-700"
        }`}
            onClick={() => setActiveTab(id)}
          >
            <Icon className="text-xl" />
            <span className="text-xs md:text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        {activeTab === 1 && (
          <ProfileDetails user={auth.user} products={gigs} token={auth.token} />
        )}
        {activeTab === 2 && <Products />}
        {activeTab === 3 && <Appointments />}
      </div>
    </div>
  );
};

export default Profile;
