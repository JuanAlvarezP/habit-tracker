import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ handleLogout }) => {
  return (
    <nav className="w-full bg-card-dark shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/habits" className="flex items-center">
              <h1 className="text-xl font-bold text-white">🎯 Habit Tracker</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="text-white hover:text-subtle-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
