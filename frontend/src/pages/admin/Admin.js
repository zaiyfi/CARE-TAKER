import { useState } from "react";
import Products from "./Products";
import Users from "./users";

// React Icons
import { GrStatusGood } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";

const Admin = () => {
  const [tab, setTab] = useState(1);
  const [activeButton, setActiveButton] = useState(1);
  
  const tabActiveIndex = (tabIndex) => {
    setTab(tabIndex);
    setActiveButton(tabIndex);
  };
  return (
    <div className="flex my-4  select-none">
      {/* Product Added Message Popup */}
      {/* {2>3 && (
        <div className="error-backend flex border-2 border-green-500 bg-white p-2 rounded">
          <GrStatusGood className=" text-green-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">Prodcut added successfully!</p>
        </div>
      )} */}

      {/* Sidebar Links */}
      <div className="tab border-e  md:w-[15%]">
        <div
          className={`links  ${activeButton === 1 ? "activeB" : ""}`}
          onClick={() => tabActiveIndex(1)}
        >
           <PiPackageFill className=" icons" />

          <button className="tablinks ">Products</button>
        </div>
        <div
          className={`links ${activeButton === 2 ? "activeB" : ""}`}
          onClick={() => tabActiveIndex(2)}
        >
                   <FaUser className=" icons" />


          <button className="tablinks">Users</button>
        </div>
      </div>

      {/* Components */}
      {tab === 1 && (
        <Products  />
      )}
      {tab === 2 && <Users />}
    </div>
  );
};

export default Admin;
