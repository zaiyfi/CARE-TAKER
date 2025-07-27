import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

// Icons
import { IoIosArrowDropdown } from "react-icons/io";
import { MdOutlineDashboardCustomize, MdHealthAndSafety } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { RiLoginBoxLine } from "react-icons/ri";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    dispatch({ type: "auth/logout" });
    setDropdown(false);
    navigate("/login");
  };

  const handleDashboardClick = () => {
    const targetUrl = auth?.user?.role === "Admin" ? "/admin" : "/dashboard";
    setDropdown(false);
    navigate(targetUrl);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-primary font-bold text-2xl"
        >
          C
          <MdHealthAndSafety className="text-3xl mx-1 text-green-600" />
          Connect
        </Link>

        {/* Main Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/home"
            className="text-gray-700 hover:text-primary transition duration-150"
          >
            Home
          </Link>
          <Link
            to="/gigs"
            className="text-gray-700 hover:text-primary transition duration-150"
          >
            Gigs
          </Link>
          {auth && (
            <button
              onClick={handleDashboardClick}
              className="text-gray-700 hover:text-primary transition duration-150"
            >
              Dashboard
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdown(!dropdown)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border hover:bg-primary hover:text-white transition ${
                dropdown ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {auth ? (
                <img
                  src={auth.user.pic}
                  className="w-7 h-7 rounded-full"
                  alt="profile"
                />
              ) : (
                <FaRegUserCircle className="text-xl" />
              )}
              <span className="text-sm">
                {auth ? auth.user.name.split(" ")[0] : "Login"}
              </span>
              <IoIosArrowDropdown
                className={`text-lg transition-transform ${
                  dropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                {auth ? (
                  <>
                    <button
                      onClick={handleDashboardClick}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-sm text-gray-700"
                    >
                      <MdOutlineDashboardCustomize />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-sm text-gray-700"
                    >
                      <IoIosLogOut />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      <RiLoginBoxLine />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      <SiGnuprivacyguard />
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
