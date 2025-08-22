import { useState } from "react";

export default function CategoryFilters({ onFilterChange }) {
  const categories = ["Trending", "New", "Ending Soon"];
  const [active, setActive] = useState("Trending");

  const handleClick = (category) => {
    setActive(category);
    onFilterChange(category); // Übergibt die gewählte Kategorie an das Parent-Component
  };

  return (
    <div className="flex justify-center gap-3 mt-6 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleClick(category)}
          className={`px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium border transition-all duration-200 shadow-sm
            ${
              active === category
                ? "bg-[#00E3A5] text-black border-[#00E3A5]"
                : "bg-[#151821] text-gray-300 border-[#23272F] hover:border-[#00E3A5]/40 hover:text-white"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}