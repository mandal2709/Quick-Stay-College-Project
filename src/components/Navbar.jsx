import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import API_BASE_URL from "../config/api";

const BookIcon = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);

const Navbar = () => {
  const navLinks = [
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ---------------------------
  // Load user from cookie (check with backend)
  // ---------------------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // ---------------------------
  // Logout
  // ---------------------------
  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // ---------------------------
  // Navbar scroll behavior
  // ---------------------------
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9 invert opacity" />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="group flex flex-col gap-0.5 text-black"
          >
            {link.name}
            <div className="bg-black h-0.5 w-0 group-hover:w-full transition-all duration-300" />
          </Link>
        ))}

        {user && (user.role === "owner" || user.role === "admin") && (
          <button
            className=" px-4 py-1 text-sm font-light rounded-full"
            onClick={() =>
              navigate(user.role === "admin" ? "/admin" : "/owner")
            }
          >
            Dashboard
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        {/* <img
          src={assets.searchIcon}
          alt="search"
          className="invert opacity h-8"
        /> */}

        {user ? (
          <div className="relative group">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-full">
              {user.fullName}
            </button>

            <div className="absolute right-0 top-full hidden group-hover:block bg-white shadow rounded w-40">
              {user && user.role === "user" && (
                <button
                  onClick={() => navigate("/my-booking")}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                >
                  <BookIcon />
                  My Booking
                </button>
              )}

              <button
                onClick={logout}
                className="px-4 py-2 text-left hover:bg-gray-100 w-full text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-2.5 rounded-full bg-black text-white"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled && "invert"} h-4`}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close" className="h-6.5" />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {user ? (
          <>
            <button
              onClick={() =>
                navigate(user.role === "admin" ? "/admin" : "/owner")
              }
            >
              Dashboard
            </button>
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-8 py-2.5 rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
