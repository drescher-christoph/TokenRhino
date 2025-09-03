import { useState } from "react";
import { Link } from "react-router-dom";

export default function Portfolio() {
  // Dummy Daten – später mit wagmi / Subgraph ersetzen
  const [investments] = useState([
    {
      id: "1",
      tokenName: "Rhino Token",
      tokenSymbol: "RNO",
      amountEth: "0.8",
      status: "CLAIMABLE",
      presale: { id: "0xPresale1" },
    },
    {
      id: "2",
      tokenName: "Moon Coin",
      tokenSymbol: "MOON",
      amountEth: "1.5",
      status: "REFUNDABLE",
      presale: { id: "0xPresale2" },
    },
    {
      id: "3",
      tokenName: "DeFi Ape",
      tokenSymbol: "APE",
      amountEth: "2.2",
      status: "ACTIVE",
      presale: { id: "0xPresale3" },
    },
  ]);

  // Stats berechnen
  const total = investments.reduce((sum, i) => sum + Number(i.amountEth), 0);
  const count = investments.length;

  const claimable = investments.filter((i) => i.status === "CLAIMABLE");
  const refundable = investments.filter((i) => i.status === "REFUNDABLE");
  const others = investments.filter(
    (i) => i.status !== "CLAIMABLE" && i.status !== "REFUNDABLE"
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-white">
      {/* Header / Stats */}
      <h1 className="text-3xl font-bold mb-6">Dein Portfolio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#0C0E13] border border-[#23272F] p-6 rounded-2xl shadow">
          <p className="text-gray-400">Gesamt investiert</p>
          <p className="text-2xl font-bold">{total.toFixed(2)} ETH</p>
        </div>
        <div className="bg-[#0C0E13] border border-[#23272F] p-6 rounded-2xl shadow">
          <p className="text-gray-400">Anzahl Investments</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="bg-[#0C0E13] border border-[#23272F] p-6 rounded-2xl shadow">
          <p className="text-gray-400">Ø Investment</p>
          <p className="text-2xl font-bold">
            {count > 0 ? (total / count).toFixed(2) : 0} ETH
          </p>
        </div>
      </div>

      {/* Claimable */}
      <h2 className="text-2xl font-semibold mb-4">Claimable</h2>
      <div className="space-y-4 mb-10">
        {claimable.length === 0 && (
          <p className="text-gray-400">Keine claimable Investments.</p>
        )}
        {claimable.map((i) => (
          <div
            key={i.id}
            className="bg-[#0C0E13] border border-[#23272F] p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-bold">
                {i.tokenName} ({i.tokenSymbol})
              </p>
              <p className="text-gray-400">Investiert: {i.amountEth} ETH</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-green-600 px-4 py-2 rounded-lg">
                Claim
              </button>
              <Link to={`/presale/${i.presale.id}`} className="underline">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Refundable */}
      <h2 className="text-2xl font-semibold mb-4">Refundable</h2>
      <div className="space-y-4 mb-10">
        {refundable.length === 0 && (
          <p className="text-gray-400">Keine refundable Investments.</p>
        )}
        {refundable.map((i) => (
          <div
            key={i.id}
            className="bg-[#0C0E13] border border-[#23272F] p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-bold">
                {i.tokenName} ({i.tokenSymbol})
              </p>
              <p className="text-gray-400">Investiert: {i.amountEth} ETH</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-red-600 px-4 py-2 rounded-lg">
                Refund
              </button>
              <Link to={`/presale/${i.presale.id}`} className="underline">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Andere */}
      <h2 className="text-2xl font-semibold mb-4">Andere Investments</h2>
      <div className="space-y-4">
        {others.length === 0 && (
          <p className="text-gray-400">Keine weiteren Investments.</p>
        )}
        {others.map((i) => (
          <div
            key={i.id}
            className="bg-[#0C0E13] border border-[#23272F] p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-bold">
                {i.tokenName} ({i.tokenSymbol})
              </p>
              <p className="text-gray-400">Investiert: {i.amountEth} ETH</p>
              <p className="text-gray-500">Status: {i.status}</p>
            </div>
            <Link to={`/presale/${i.presale.id}`} className="underline">
              View Presale
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}