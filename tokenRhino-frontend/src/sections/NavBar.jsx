import React from "react";

const NavBar = () => {
  return (
    <header>
  <div className="fixed top-0 left-0 right-0 z-50 bg-[#0C0E13] border-b border-[#23272F] shadow-md">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
      
      {/* Logo */}
      <h3 className="text-2xl font-bold text-white cursor-pointer tracking-tight">
        Token<span className="text-[#00E3A5]">Rhino</span>
      </h3>

      {/* Navigation */}
      <ul className="hidden md:flex flex-row space-x-8 text-white text-sm font-medium">
        <li className="cursor-pointer hover:text-[#00E3A5] transition-colors duration-200">Markets</li>
        <li className="cursor-pointer hover:text-[#00E3A5] transition-colors duration-200">Create Presale</li>
        <li className="cursor-pointer hover:text-[#00E3A5] transition-colors duration-200">Portfolio</li>
        <li className="cursor-pointer hover:text-[#00E3A5] transition-colors duration-200">Docs</li>
      </ul>

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
