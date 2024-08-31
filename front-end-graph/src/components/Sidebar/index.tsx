'use client'
import React, { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Botão para abrir o Sidebar */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-full focus:outline-none"
        onClick={toggleSidebar}
      >
        Menu
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <button
          className="absolute top-4 right-4 text-white"
          onClick={toggleSidebar}
        >
          X
        </button>
        <div className="mt-16">
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <a href="#home">Home</a>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
