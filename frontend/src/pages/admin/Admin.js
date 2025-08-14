import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";
import { SiReadthedocs } from "react-icons/si";
import Users from "./users";
import Verifications from "./Verifications";
import Products from "./Products";
import AdminDashboard from "./AdminDashboard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, icon: MdDashboard, label: "Dashboard" },
    { id: 2, icon: FaUsers, label: "Users" },
    { id: 3, icon: PiPackageFill, label: "Products" },
    { id: 4, icon: SiReadthedocs, label: "Verifications" },
  ];

  return (
    <div className="flex flex-col md:flex-row my-4 select-none h-[calc(100vh-2rem)]">
      {/* Sidebar */}
      <div className="flex md:flex-col w-full md:w-[14%] bg-white border-b md:border-b-0 md:border-r shadow-sm md:h-[80vh]">
        {tabs.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`flex-1 flex flex-col items-center gap-2 py-4 cursor-pointer transition-all duration-300
        ${
          activeTab === id
            ? "bg-primary text-white font-semibold shadow-md scale-105"
            : "hover:bg-lightPrimary text-gray-700 hover:shadow-sm"
        }
      `}
            style={{
              borderRadius: "8px",
              margin: "4px",
            }}
            onClick={() => setActiveTab(id)}
          >
            <Icon className="text-2xl" />
            <span className="text-sm md:text-base">{label}</span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto h-full">
        {activeTab === 1 && <AdminDashboard />}
        {activeTab === 2 && <Users />}
        {activeTab === 3 && <Products />}
        {activeTab === 4 && <Verifications />}
      </div>
    </div>
  );
};

export default Admin;
