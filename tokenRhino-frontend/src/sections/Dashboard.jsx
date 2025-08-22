import React from "react";
import SearchBar from "../components/Searchbar";
import CategoryFilters from "../components/CategoryFilters";

const Dashboard = () => {

    const handleFilterChange = () => {
        
    }

  return (
    <div className="mx-auto max-w-7xl px-4 mt-38 sm:px-6 lg:px-8">
      {/* HERO SECTION */}
      <div className="flex flex-col justify-center items-center">
        <div className="text-center space-y-4 mt-8">
          <h2 className="text-white font-extrabold text-5xl sm:text-6xl tracking-tight">
            Explore Live Token Presales
          </h2>
          <p className="text-[#9CA3AF] font-medium text-lg sm:text-xl max-w-2xl mx-auto">
            Join early-stage token launches — simple, secure & transparent.
          </p>
        </div>
        <div className="mt-10 sm:mt-12 lg:mt-14 w-full flex justify-center">
          <SearchBar />
        </div>
        <CategoryFilters onFilterChange={handleFilterChange} />
      </div>
      <div className="bg-white">
        <button>Hello World</button>
      </div>
    </div>
  );
};

export default Dashboard;
