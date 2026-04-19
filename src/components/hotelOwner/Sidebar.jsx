import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
    { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
    { name: "List Room", path: "/owner/list-room", icon: assets.listIcon },
  ];
  return (
    <div
      className="flex w-full gap-2 overflow-x-auto border-b border-gray-300 bg-white p-3 text-base transition-all duration-300 lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:pt-4"
    >
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end="/owner"
          className={({ isActive }) =>
            `flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 lg:rounded-none lg:px-8 ${
              isActive
                ? "bg-blue-600/10 text-blue-600 lg:border-r-4 lg:border-blue-600"
                : "text-gray-700 hover:bg-gray-100/90"
            }`
          }
        >
          <img src={item.icon} alt="item.name" className="min-h-6 min-w-6" />
          <p className="block text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
