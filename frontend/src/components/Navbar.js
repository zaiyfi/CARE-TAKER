import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Icons
import { IoIosArrowDropdown } from "react-icons/io";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { RiLoginBoxLine } from "react-icons/ri";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaRegUserCircle } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";

import { useState } from "react";
import store from "../redux/store";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);

  // redux states
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Router Navigate
  const navigate = useNavigate();

  // Logout Functionality
  const handleLogout = async () => {
    localStorage.removeItem("auth");
    navigate("/login");
    dispatch({ type: "auth/logout" });
    console.log(store.getState());
    setDropdown(!dropdown);
  };

  // Button Funtionality
  const handleClick = () => {
    // Determining the target URL based on the user's role
    const targetUrl = auth.user.role === "Admin" ? "/admin" : "/dashboard";

    navigate(targetUrl);

    setDropdown(false);
  };

  const path = window.location.pathname;
  return (
    <div className="sticky top-0" style={{ zIndex: 1000 }}>
      <header
        className={`shadow-md shadow-gray drop-shadow-md bg-white ${
          path === "/dashboard" && " shadow-none drop-shadow-none "
        }  flex justify-between py-4 px-6 items-center`}
      >
        <Link
          className={`logo text-xl font-bold text-primary flex items-center`}
          to="/"
        >
          C
          <span className="">
            <MdHealthAndSafety className=" text-3xl" />
          </span>
          Connect
        </Link>

        {/* Show this if user is logged in */}
        {/* DropDown */}

        <div>
          <div
            className={`round-img nav-t-r hover:bg-primary hover:text-white ${
              dropdown === true && "bg-primary text-white"
            }`}
            onClick={() => setDropdown(!dropdown)}
          >
            {auth ? (
              <img
                src={auth.user.pic}
                className="w-[28px] h-[28px] rounded-full me-1"
                alt=""
              />
            ) : (
              <FaRegUserCircle className="text-xl  me-1" />
            )}
            {auth ? <p>{auth.user.name}</p> : <p>Login</p>}
            <IoIosArrowDropdown
              className={`icon-rotate text-2xl ms-1 ${
                dropdown === true && "rotate-180 "
              }`}
            />
          </div>

          {dropdown === true && (
            <div className="dropdown border-2 shadow-2xl ">
              {auth && (
                <div>
                  <div className="links " onClick={handleClick}>
                    <MdOutlineDashboardCustomize className="icons" />{" "}
                    <button>Dashboard</button>
                  </div>
                  <div className="links " onClick={handleLogout}>
                    <IoIosLogOut className="icons" />
                    <button>Logout</button>
                  </div>
                </div>
              )}
              {!auth && (
                <div>
                  <div
                    className="links "
                    onClick={() => {
                      navigate("/login");
                      setDropdown(!dropdown);
                    }}
                  >
                    <RiLoginBoxLine className="icons" /> <button>Login</button>
                  </div>
                  <div
                    className="links "
                    onClick={() => {
                      navigate("/register");
                      setDropdown(!dropdown);
                    }}
                  >
                    <SiGnuprivacyguard className="icons" />{" "}
                    <button>Register</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Show this if User is not logged in */}
      </header>
    </div>
  );
};

export default Navbar;
