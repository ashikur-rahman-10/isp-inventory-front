import  { useContext, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate, } from "react-router-dom";
import "./NavigationBar.css";
import { AuthContext } from "../../Providers/AuthProviders";
import logo from "../../assets/logo.png";

import UseAdmin from "../../Hooks/UseAdmin";

import { FaSignOutAlt, FaSmileBeam } from "react-icons/fa";
import CustomLoader from "../CustomLoader/CustomLoader";
import Swal from "sweetalert2";


const NavigationBar = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const { admin, usersRefetch } = UseAdmin();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (user && !user?.emailVerified) {
      Swal.fire({
        icon: "info",
        title: "Please check your email to verify your account.",
        showConfirmButton: false,
        timer: 3000,
      });

      setTimeout(() => {
        logout()
          .then((result) => { })
          .catch((error) => { });
      }, 3000);
    }
    usersRefetch()
  }, [user]);

  const handleLogout = () => {
    logout()
      .then((result) => { })
      .catch((error) => { });
  };

  const handleClickLogin = () => {
    navigate("/login", { state: location });
  }





  if (loading) {
    return <CustomLoader></CustomLoader>
  }

  return (
    <div className="bg-white">
      <div className="flex w-full items-center border-b border-success">
        <div className="navbar max-w-7xl mx-auto">
          <div className="navbar-start">
            <Link to={"/"} className="flex items-center ml-2  md:ml-4">
              <img className="h-10" src={logo} alt="" />
            </Link>
          </div>

           <div className="w-full text-center  ">
          <NavLink
            className="font-medium px-3 py-2 rounded-lg hover:bg-slate-200 lg:text-[13px] text-xs text-success"
            to={"/"}
          >
            Home
          </NavLink>
          <NavLink
            className="font-medium px-3 py-2 rounded-lg hover:bg-slate-200 lg:text-[13px] text-xs text-success"
            to={"/books"}
          >
            All Books
          </NavLink>
         
        
          <NavLink
            className="font-medium px-3 py-2 rounded-lg hover:bg-slate-200 lg:text-[13px] text-xs text-success"
            to={"/add-book"}
          >
            Add Books
          </NavLink>
        
        </div>
          <div className="navbar-end">
            {!user && (
              <span>
                <p
                  onClick={handleClickLogin}
                  className=" font-medium px-3 py-2 rounded-lg hover:bg-slate-200 lg:text-[13px] text-xs text-success cursor-pointer"

                >
                  Login
                </p>
              </span>
            )}
            {user && (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full outline outline-success">
                    <img src={user.photoURL} alt="User Avatar" />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact space-y-2 dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <NavLink
                      to={`/users/${user?.displayName}`}
                      className="justify-between"
                    >
                      <FaSmileBeam className=" text-2xl text-green-600"></FaSmileBeam>{" "}
                      <span className="text-sm"> Manage My Account</span>
                    </NavLink>
                  </li>
                  {user && (
                    <li>
                      <a onClick={handleLogout} className="text-red-400">
                        <FaSignOutAlt className="text-xl"></FaSignOutAlt>{" "}
                        <span className="text-xs">Logout</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>       
      </div>
    </div>
  );
};

export default NavigationBar;
