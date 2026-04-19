import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import API_BASE_URL from "../config/api";

const BookIcon = () => (
  <svg
    className="h-4 w-4 text-gray-700"
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

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

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const useDarkHeader = location.pathname !== "/" || isScrolled || isMenuOpen;
  const navTextClass = useDarkHeader ? "text-gray-900" : "text-white";

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 shadow-md backdrop-blur-lg"
          : "bg-gradient-to-b from-black/35 via-black/10 to-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className={`h-9 ${useDarkHeader ? "invert opacity-90" : ""}`}
          />
        </Link>

        <div className="hidden items-center gap-4 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex flex-col gap-0.5 ${navTextClass}`}
            >
              {link.name}
              <div className="h-0.5 w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {user && (user.role === "owner" || user.role === "admin") && (
            <button
              className={`rounded-full border px-4 py-1 text-sm font-light ${navTextClass}`}
              onClick={() =>
                navigate(user.role === "admin" ? "/admin" : "/owner")
              }
            >
              Dashboard
            </button>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="group relative">
              <button
                className={`flex items-center gap-2 rounded-full border px-4 py-2 ${navTextClass}`}
              >
                {user.fullName}
              </button>

              <div className="absolute right-0 top-full hidden w-40 rounded bg-white shadow group-hover:block">
                {user.role === "user" && (
                  <button
                    onClick={() => navigate("/my-booking")}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <BookIcon />
                    My Booking
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-black px-8 py-2.5 text-white"
            >
              Login
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <button
              onClick={() =>
                navigate(
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "owner"
                      ? "/owner"
                      : "/my-booking",
                )
              }
              className={`rounded-full border px-3 py-1 text-xs font-medium ${navTextClass}`}
            >
              {user.role === "user" ? "Trips" : "Panel"}
            </button>
          )}

          <img
            onClick={() => setIsMenuOpen((prev) => !prev)}
            src={assets.menuIcon}
            alt="menu"
            className={`h-4 cursor-pointer ${isScrolled ? "invert" : ""}`}
          />
        </div>
      </div>

      <div
        className={`fixed left-0 top-0 flex h-screen w-full flex-col bg-white px-6 pt-24 transition-all duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute right-4 top-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close" className="h-6 w-6" />
        </button>

        <div className="flex flex-col gap-5 text-lg font-medium text-gray-900">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user?.role === "user" && (
            <button
              onClick={() => {
                navigate("/my-booking");
                setIsMenuOpen(false);
              }}
              className="text-left"
            >
              My Booking
            </button>
          )}

          {user && (user.role === "owner" || user.role === "admin") && (
            <button
              onClick={() => {
                navigate(user.role === "admin" ? "/admin" : "/owner");
                setIsMenuOpen(false);
              }}
              className="text-left"
            >
              Dashboard
            </button>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3 pb-10">
          {user ? (
            <button
              onClick={logout}
              className="rounded-full border border-red-200 px-6 py-3 text-red-500"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
              className="rounded-full bg-black px-8 py-3 text-white"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
