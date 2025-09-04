export const Badge = ({ color = "indigo", children }) => {
  const map = {
    green: "bg-green-500/15 text-green-300 border-green-500/20",
    red: "bg-red-500/15 text-red-300 border-red-500/20",
    yellow: "bg-yellow-500/15 text-yellow-200 border-yellow-500/20",
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
    gray: "bg-gray-500/15 text-gray-300 border-gray-500/20",
  };

  function classNames(...xs) {
    return xs.filter(Boolean).join(" ");
  }

  return (
    <span
      className={classNames("px-2 py-1 rounded border text-xs", map[color])}
    >
      {children}
    </span>
  );
};
