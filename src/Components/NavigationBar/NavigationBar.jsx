import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, } from "react-router-dom";
import "./NavigationBar.css";
import { AuthContext } from "../../Providers/AuthProviders";
import logo from "../../assets/logo.png";

import UseCart from "../../Hooks/UseCart";
import UseAdmin from "../../Hooks/UseAdmin";

import { FaBox, FaGrinStars, FaSignOutAlt, FaSmileBeam } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import CustomLoader from "../CustomLoader/CustomLoader";
import Swal from "sweetalert2";
import UseAllBooks from "../../Hooks/UseAllBooks";
import { TfiWrite } from "react-icons/tfi";
import { IoNewspaperOutline } from "react-icons/io5";

const NavigationBar = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { books } = UseAllBooks();
  const { cart, cartRefetch } = UseCart(user?.email);
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
    cartRefetch();
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


  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  let filteredBooks = [];

  if (searchTerm) {
    filteredBooks = books.filter(
      (book) =>
        book.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by Bengali book name
        book.bookName_en?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by English book name
        book.writerName?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by English book name
        book.publications?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by English book name
        book.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) // Search by English book name
    );
  }

  if (loading) {
    return <CustomLoader></CustomLoader>
  }

  return (
    <div className="bg-white">
      <div className="flex flex-col w-full items-center border-b border-success">
        <div className="navbar max-h-14  max-w-7xl mx-auto">
          <div className="navbar-start">

            <Link to={"/"} className="flex items-center ml-2  md:ml-4">
              <img className="h-10" src={logo} alt="" />
            </Link>
          </div>
          <span className="md:hidden navbar-center">
            <input
              type="text"
              placeholder="Search by book name"
              className="px-2 py-1 text-[13px] focus:outline-none text-center rounded-3xl input input-bordered input-success ml-3 w-36"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </span>
          <div className="navbar-center hidden md:flex">
            <ul className="menu menu-horizontal px-1">
              <input
                type="text"
                placeholder="Search by book name"
                className="px-4 py-2 text-center text-sm focus:outline-none input rounded-3xl input-bordered input-success w-80"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </ul>
          </div>
          <div className="navbar-end">
            <div className="dropdown dropdown-end lg:mr-3 mr-1">
              <label tabIndex={0} className="">
                {user && !admin && (
                  <NavLink
                    to={"/cart"}
                    className="indicator relative hover:bg-slate-200 p-4 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#149352]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="badge bg-green-500 text-white absolute left-0 bottom-2">
                      {cart.length}
                    </p>
                  </NavLink>
                )}
              </label>
            </div>
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

                  <li>
                    <NavLink
                      to={`/add-blog`}
                      className=""
                    >
                      <TfiWrite className=" text-2xl text-green-600"></TfiWrite>{" "}
                      <span className="text-sm">Write a Blog</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/my-blogs`}
                      className=""
                    >
                      <IoNewspaperOutline className=" text-2xl text-green-600"></IoNewspaperOutline>{" "}
                      <span className="text-sm">My Blogs</span>
                    </NavLink>
                  </li>
                  {
                    user && !admin &&
                    <>
                      <li>
                        <NavLink to={"/order-history"}>
                          <FaBox className="text-xl  text-green-600"></FaBox>{" "}
                          <span className="text-sm">Order History</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={"/my-reviews"}>
                          <FaGrinStars className="text-xl  text-green-600"></FaGrinStars>{" "}
                          <span className="text-sm">My Reviews</span>
                        </NavLink>
                      </li></>
                  }
                  {
                    user && admin && <li>
                      <NavLink to={"/dashboard"}>
                        <MdDashboardCustomize className="text-xl  text-green-600"></MdDashboardCustomize>{" "}
                        <span className="text-sm">Dashboard</span>
                      </NavLink>
                    </li>
                  }
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
        {/* Main menu */}
        <div className=" pb-2  w-full text-center  ">
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
            to={"/categories"}
          >
            Categories
          </NavLink>
          <NavLink
            className="font-medium px-3 py-2 rounded-lg hover:bg-slate-200 lg:text-[13px] text-xs text-success"
            to={"/publications"}
          >
            Publications
          </NavLink>
          <NavLink
            className="font-medium px-3 py-2 rounded-lg hover:bg-slate-200 lg:text-[13px] text-xs text-success"
            to={"/blogs"}
          >
            Blogs
          </NavLink>
        </div>
      </div>

      {/* Render search results */}
      <div className="relative flex items-center w-full justify-center">
        <ul className="absolute mx-auto bg-gray-200 max-h-[510px] overflow-y-auto md:-top-9 -top-7 duration-1000">
          {filteredBooks?.map((book) => (
            <Link
              onClick={() => {
                setSearchTerm("");
              }}
              to={`/books/${book._id}`}
              key={book._id}
            >
              <li className="border-b border-white py-2 px-2 w-80 hover:bg-slate-50">
                <div className="flex">
                  <div>
                    <img className="w-10 h-10 mr-2" src={book.image} alt="" />
                  </div>
                  <div className="text-xs">
                    {book.bookName}
                    <br />
                    <span className="text-[10px]">{book?.writerName}</span>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationBar;
