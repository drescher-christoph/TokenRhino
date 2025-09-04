function classNames(...xs) {
    return xs.filter(Boolean).join(" ");
  }

export const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={classNames(
      "px-4 py-2 rounded-full border transition",
      active
        ? "bg-indigo-600 border-indigo-600 text-white"
        : "bg-[#0C0E13] border-[#23272F] text-gray-300 hover:border-gray-500"
    )}
  >
    {children}
  </button>
);