import { useState } from "react";
import Products from "./Products";
import Users from "./users";

// React Icons
import { FaUser } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";

import { GrDocumentVerified } from "react-icons/gr";
import Verifications from "./Verifications";

const Admin = () => {
  const [tab, setTab] = useState(1);
  const [activeButton, setActiveButton] = useState(1);

  const tabActiveIndex = (tabIndex) => {
    setTab(tabIndex);
    setActiveButton(tabIndex);
  };
  return (
    <div className="flex my-4  select-none">
      {/* Sidebar Links */}
      <div className="tab border-e md:w-[15%] bg-gray-50 shadow-inner h-fit rounded-xl p-2">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer mb-2 transition-colors ${
            activeButton === 1
              ? "bg-lightSecondary text-primary font-semibold"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => tabActiveIndex(1)}
        >
          <PiPackageFill className="text-lg" />
          <span>Products</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer mb-2 transition-colors ${
            activeButton === 2
              ? "bg-lightSecondary text-primary font-semibold"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => tabActiveIndex(2)}
        >
          <FaUser className="text-lg" />
          <span>Users</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            activeButton === 3
              ? "bg-lightSecondary text-primary font-semibold"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => tabActiveIndex(3)}
        >
          <GrDocumentVerified className="text-lg" />

          <span>Verifications</span>
        </div>
      </div>

      {/* Components */}
      {tab === 1 && <Products />}
      {tab === 2 && <Users />}
      {tab === 3 && <Verifications />}
    </div>
  );
};

export default Admin;
