import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";
import API_BASE_URL from "../../config/api";

const Navbar = () => {
  const handleLogout = async () => {
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
    window.location.href = "/login";
  };

  return (
    <div
      className="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3 md:px-8"
    >
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9 invert opacity-80" />
      </Link>

      <button
        onClick={handleLogout}
        className="rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 sm:px-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
