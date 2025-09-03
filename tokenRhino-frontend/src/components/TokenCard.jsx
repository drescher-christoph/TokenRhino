import { useState, useEffect } from "react";
import { usePresaleMetadata } from "../hooks/usePresaleMetadata";
import { PresaleAbi } from "../abi/Presale";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { meta } from "@eslint/js";
import { m } from "framer-motion";

const TokenCard = ({
  id,
  logo,
  name,
  symbol,
  price,
  change,
  goal,
  metadataCID,
  contract,
}) => {
  // Bestimmen der Textfarbe abhängig vom 24h Change
  const changeColor = change >= 0 ? "text-green-400" : "text-red-400";

  const [raisedDirect, setRaisedDirect] = useState(null);

  useEffect(() => {
    async function fetchRaised() {
      if (!id) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const presaleContract = new ethers.Contract(id, PresaleAbi, provider);
        const raised = await presaleContract.s_totalRaisedWei();
        setRaisedDirect(raised);
      } catch (err) {
        console.error("Error fetching raised from contract:", err);
      }
    }
    fetchRaised();
  }, [id]);

  function formatCompactNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
    return num.toFixed(2);
  }

  const raisedEth = raisedDirect ? Number(ethers.formatUnits(raisedDirect)) : 0;
  const goalEth = goal ? Number(goal) : 0;
  const progress =
    (Number.parseFloat(raisedEth) / Number.parseFloat(goal)) * 100;

  const { metadata, loading, error } = usePresaleMetadata(
    metadataCID,
    contract
  );

  const presaleData = {
    id,
    logo,
    name,
    symbol,
    price,
    change,
    goal,
    metadataCID,
    contract,
    metadata,
  };

  if (loading) {
    return (
      <div className="bg-[#161B22] border border-[#23272F] rounded-2xl p-5 shadow-md w-full max-w-sm">
        <p className="text-gray-400 text-center">Loading metadata...</p>
      </div>
    );
  }

  return (
    <Link
      to={`/presale/${id}`}
      state={{ presaleData: presaleData }}
      className="presale-card-link"
    >
      <div className="bg-[#161B22] border border-[#23272F] rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out w-full max-w-sm">
        {/* Token Logo + Name */}
        <div className="flex items-center gap-3">
          <img
            src={metadata?.image || logo}
            alt={`${name} logo`}
            className="w-12 h-12 rounded-full border border-[#23272F]"
          />
          <div>
            <h3 className="text-white font-bold text-lg">{name}</h3>
            <p className="text-gray-400 text-sm">{symbol}</p>
          </div>
        </div>

        {/* Preis + Change */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-white font-semibold text-xl">
            {typeof price === "number" ? formatCompactNumber(price) : price} /
            ETH
          </p>
          <p className={`font-semibold ${changeColor}`}>
            {change > 0 ? "+" : ""}
            {change}%
          </p>
        </div>

        {/* Presale Progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400 text-xs">Raised </span>
            <span className="text-gray-400 text-xs">
              {formatCompactNumber(raisedEth)} / {goal} ETH
            </span>
          </div>
          <div className="w-full bg-[#1A1D24] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-end text-xs text-gray-400 mt-1">
            <span>{progress.toFixed(1)}% Complete</span>
          </div>
        </div>

        {/* Join Presale Button */}
        <button className="mt-5 w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg transition-all duration-300">
          Join Presale
        </button>
      </div>
    </Link>
  );
};

export default TokenCard;
