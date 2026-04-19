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
      className="flex item-center justify-between px-4 md:px-8 border-b border-gray-300 py-3
    bg-white transition-all duration-300"
    >
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9 invert opacity-80" />
      </Link>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
