// src/pages/Markets.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Chip } from "../components/Chip";

const dummyPresales = [
  {
    id: "0xPresale1",
    name: "Rhino Token",
    symbol: "RNO",
    chain: "Sepolia",
    status: "ACTIVE", // ACTIVE | CLAIMABLE | REFUNDABLE | ENDED
    hardCapEth: 50,
    softCapEth: 30,
    raisedEth: 18.4,
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 2, // +2 Tage
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // vor 1 Tag
    trendingScore: 92,
  },
  {
    id: "0xPresale2",
    name: "Moon Coin",
    symbol: "MOON",
    chain: "Base",
    status: "ACTIVE",
    hardCapEth: 80,
    softCapEth: 50,
    raisedEth: 66.2,
    endTime: Date.now() + 1000 * 60 * 60 * 8, // 8h
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    trendingScore: 75,
  },
  {
    id: "0xPresale3",
    name: "DeFi Ape",
    symbol: "APE",
    chain: "Polygon",
    status: "ENDED",
    hardCapEth: 40,
    softCapEth: 25,
    raisedEth: 40,
    endTime: Date.now() - 1000 * 60 * 60 * 2, // vorbei
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    trendingScore: 61,
  },
  {
    id: "0xPresale4",
    name: "Panda Swap",
    symbol: "PANDA",
    chain: "Arbitrum",
    status: "CLAIMABLE",
    hardCapEth: 100,
    softCapEth: 60,
    raisedEth: 88,
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    trendingScore: 84,
  },
];

function timeRemaining(ms) {
  const diff = ms - Date.now();
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}



const Progress = ({ value, max }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full h-2 bg-[#151922] rounded-full overflow-hidden">
      <div
        className="h-full bg-indigo-600 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default function Markets() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All"); // All | Trending | New | Ending
  const [sort, setSort] = useState("Relevance"); // Relevance | Ending Soon | Most Raised | Newest
  const [liveOnly, setLiveOnly] = useState(true);

  const filtered = useMemo(() => {
    let items = [...dummyPresales];

    // live only
    if (liveOnly) {
      items = items.filter((p) => p.status === "ACTIVE" && p.endTime > Date.now());
    }

    // search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.symbol.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    // category
    if (category === "Trending") {
      items = items.filter((p) => p.trendingScore >= 80);
    } else if (category === "New") {
      const sevenDays = 1000 * 60 * 60 * 24 * 7;
      items = items.filter((p) => Date.now() - p.createdAt <= sevenDays);
    } else if (category === "Ending") {
      const threeDays = 1000 * 60 * 60 * 24 * 3;
      items = items.filter(
        (p) => p.status === "ACTIVE" && p.endTime - Date.now() <= threeDays && p.endTime > Date.now()
      );
    }

    // sort
    if (sort === "Ending Soon") {
      items.sort((a, b) => a.endTime - b.endTime);
    } else if (sort === "Most Raised") {
      items.sort((a, b) => b.raisedEth - a.raisedEth);
    } else if (sort === "Newest") {
      items.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === "Relevance") {
      // simple: trendingScore desc
      items.sort((a, b) => b.trendingScore - a.trendingScore);
    }

    return items;
  }, [query, category, sort, liveOnly]);

  const statusColor = (s) =>
    s === "ACTIVE" ? "green" : s === "CLAIMABLE" ? "indigo" : s === "REFUNDABLE" ? "yellow" : "gray";

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-white">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          Live presales
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Explore Token Presales
        </h1>
        <p className="text-gray-400 mt-3">
          Simple, secure & transparent early-stage launches.
        </p>
        <div className="mt-6">
          <Link
            to="/create-presale"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition"
          >
            + Create Presale
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, symbol or address…"
              className="w-full rounded-xl bg-[#0C0E13] border border-[#23272F] px-5 py-3 outline-none focus:border-gray-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              ⌘K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-300 bg-[#0C0E13] border border-[#23272F] px-3 py-2 rounded-xl">
            <input
              type="checkbox"
              checked={liveOnly}
              onChange={(e) => setLiveOnly(e.target.checked)}
              className="accent-indigo-600"
            />
            Live only
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#0C0E13] border border-[#23272F] px-3 py-2 rounded-xl text-sm"
          >
            <option>Relevance</option>
            <option>Ending Soon</option>
            <option>Most Raised</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-3 mb-8">
        {["All", "Trending", "New", "Ending"].map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-gray-400">No results found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const pct = Math.min(100, Math.round((p.raisedEth / p.hardCapEth) * 100));
            return (
              <div
                key={p.id}
                className="bg-[#0C0E13] border border-[#23272F] rounded-2xl p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {p.name} <span className="text-gray-400">({p.symbol})</span>
                      </h3>
                      <Badge color={statusColor(p.status)}>{p.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{p.chain}</p>
                  </div>
                  <Badge color="indigo">{timeRemaining(p.endTime)}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={p.raisedEth} max={p.hardCapEth} />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Raised: {p.raisedEth} ETH</span>
                    <span>Hardcap: {p.hardCapEth} ETH</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    to={`/presale/${p.id}`}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
                  >
                    View
                  </Link>
                  {p.trendingScore >= 80 && <Badge color="yellow">Trending</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}