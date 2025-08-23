import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <header>
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0C0E13] border-b border-[#23272F] shadow-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <h3 className="text-2xl font-bold text-white cursor-pointer tracking-tight">
              Token<span className="text-[#00E3A5]">Rhino</span>
            </h3>
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex gap-8 text-white font-medium">
              <li>
                <NavLink
                  to="/markets"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#00E3A5] font-bold"
                      : "hover:text-[#A3A3A3]"
                  }
                >
                  Markets
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/create-presale"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#00E3A5] font-bold"
                      : "hover:text-[#A3A3A3]"
                  }
                >
                  Create Presale
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/portfolio"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#00E3A5] font-bold"
                      : "hover:text-[#A3A3A3]"
                  }
                >
                  Portfolio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/docs"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#00E3A5] font-bold"
                      : "hover:text-[#A3A3A3]"
                  }
                >
                  Docs
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Wallet Button */}
          <button className="bg-[#00E3A5] hover:bg-[#00C896] transition-colors duration-300 text-[#0F1117] font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-[#00E3A5]/40">
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
