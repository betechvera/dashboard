import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Header: React.FC = () => {
  const { user, logout } = useAuth(); // Replace with actual user name

  const fullName = user ? `${user.name} ${user.last_name}` : "";

  return (
    <header className="bg-green-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-green-200">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-200">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-200">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <FaUserCircle size={24} className="mr-[-4px]" />
          <span>{fullName}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
