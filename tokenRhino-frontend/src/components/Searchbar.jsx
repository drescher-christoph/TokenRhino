import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const containerRef = useRef(null);

  // Demo-Daten – später via API ersetzen
  const allResults = useMemo(
    () => [
      { id: "1", name: "TokenRhino", symbol: "RHINO", raised: "23.4 / 100 ETH", status: "active" },
      { id: "2", name: "Astra", symbol: "AST", raised: "8.2 / 25 ETH", status: "ending" },
      { id: "3", name: "Neon Pepe", symbol: "PEPEx", raised: "50 / 50 ETH", status: "soldout" },
      { id: "4", name: "LayerCat", symbol: "CAT", raised: "1.1 / 10 ETH" },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.trim().toLowerCase();
    return allResults.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.symbol.toLowerCase().includes(s)
    ).slice(0, 8);
  }, [q, allResults]);

  // Klick außerhalb => Dropdown schließen
  useEffect(() => {
    const onClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Keyboard Navigation
  const onKeyDown = (e) => {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoverIdx((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoverIdx((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = filtered[hoverIdx] || filtered[0];
      if (pick) {
        console.log("Go to:", pick);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl">
      {/* Suchleiste + Filterbutton */}
      <div className="flex items-center gap-3">
        <div className="flex items-center w-full h-14 rounded-xl bg-[#151821] border border-[#23272F] px-4 shadow-md focus-within:border-[#00E3A5]/70 transition-colors">
          <FiSearch className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setHoverIdx(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search presales by name or symbol…"
            className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-base md:text-lg"
          />
        </div>

        {/* Filter Button */}
        <button
          className="h-14 px-4 md:px-5 rounded-xl bg-[#23272F] border border-[#2F333D] text-white text-sm md:text-base font-medium shadow-md hover:bg-[#2B313B] hover:border-[#00E3A5] transition-colors flex items-center gap-2"
          onClick={() => console.log("open filters")}
        >
          <FiFilter size={18} className="text-[#00E3A5]" />
          Filter
        </button>
      </div>

      {/* Dropdown-Ergebnisse */}
      {open && q.trim() && (
        <div
          id="search-results"
          className="absolute left-0 right-0 mt-2 rounded-xl bg-[#0C0E13] border border-[#23272F] shadow-2xl overflow-hidden z-40"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-400">
              No results for “{q}”.
            </div>
          ) : (
            <ul className="max-h-96 overflow-auto">
              {filtered.map((r, i) => (
                <li
                  key={r.id}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
                    i === hoverIdx ? "bg-[#151A22]" : "hover:bg-[#131720]"
                  }`}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseDown={() => {
                    console.log("Go to:", r);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1F29] border border-[#23272F]" />
                    <div>
                      <div className="text-white text-sm md:text-base font-medium">
                        {r.name}{" "}
                        <span className="text-[#9CA3AF]">· {r.symbol}</span>
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        Raised: {r.raised}
                      </div>
                    </div>
                  </div>
                  {r.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        r.status === "active"
                          ? "bg-[#0F2E23] text-[#00E3A5]"
                          : r.status === "ending"
                          ? "bg-[#2A240B] text-[#FFB020]"
                          : "bg-[#32121A] text-[#FF4E6D]"
                      }`}
                    >
                      {r.status === "active"
                        ? "Active"
                        : r.status === "ending"
                        ? "Ending soon"
                        : "Sold out"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}