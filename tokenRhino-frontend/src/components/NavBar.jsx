import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header>
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0C0E13] border-b border-[#23272F] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu}>
            <h3 className="text-2xl font-bold text-white cursor-pointer tracking-tight">
              Token<span className="text-[#00E3A5]">Rhino</span>
            </h3>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-6 lg:gap-8 text-white font-medium">
              <li>
                <NavLink
                  to="/create-presale"
                  className={({ isActive }) =>
                    `transition-colors duration-200 ${
                      isActive
                        ? "text-[#00E3A5] font-bold"
                        : "hover:text-[#A3A3A3]"
                    }`
                  }
                >
                  Create
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/portfolio"
                  className={({ isActive }) =>
                    `transition-colors duration-200 ${
                      isActive
                        ? "text-[#00E3A5] font-bold"
                        : "hover:text-[#A3A3A3]"
                    }`
                  }
                >
                  Portfolio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/docs"
                  className={({ isActive }) =>
                    `transition-colors duration-200 ${
                      isActive
                        ? "text-[#00E3A5] font-bold"
                        : "hover:text-[#A3A3A3]"
                    }`
                  }
                >
                  Docs
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Wallet Button - Hidden on mobile */}
          <div className="hidden sm:block">
            <ConnectButton showBalance={true} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 mt-16"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <div className="fixed top-16 left-0 right-0 bg-[#0C0E13] border-b border-[#23272F] shadow-lg z-50">
              <nav className="px-6 py-4">
                <ul className="space-y-4">
                  <li>
                    <NavLink
                      to="/create-presale"
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "text-[#00E3A5] font-bold bg-[#00E3A5]/10"
                            : "text-white hover:bg-[#23272F]"
                        }`
                      }
                      onClick={closeMobileMenu}
                    >
                      Create Presale
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/portfolio"
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "text-[#00E3A5] font-bold bg-[#00E3A5]/10"
                            : "text-white hover:bg-[#23272F]"
                        }`
                      }
                      onClick={closeMobileMenu}
                    >
                      Portfolio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/docs"
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "text-[#00E3A5] font-bold bg-[#00E3A5]/10"
                            : "text-white hover:bg-[#23272F]"
                        }`
                      }
                      onClick={closeMobileMenu}
                    >
                      Documentation
                    </NavLink>
                  </li>
                </ul>
                
                {/* Wallet Button for Mobile */}
                <div className="mt-6 pt-4 border-t border-[#23272F]">
                  <div className="flex justify-center">
                    <ConnectButton showBalance={false} />
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Add padding to prevent content from being hidden under fixed navbar */}
      <div className="h-16"></div>
    </header>
  );
};

export default NavBar;