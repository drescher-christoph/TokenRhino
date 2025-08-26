import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Stepper from "../components/Stepper";
import { ethers } from "ethers";
import { erc20Abi } from "../abi/erc20Abi";

// Hilfsfunktion um sicher Daten aus dem localStorage zu lesen
function readDraft(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function FundContract() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [presaleData, setPresaleData] = useState(() => {
    const s = localStorage.getItem("createDraftPresale");
    return s ? JSON.parse(s) : {};
  });


  if (!presaleData && !presaleAddr) {
    return <div>Lade Presale-Daten...</div>;
  }

  const handleFund = async () => {
    if (!window.ethereum) {
      alert("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Token Contract Adresse aus presaleData
      const tokenAddress = presaleData?.token?.tokenAddress;
      const tokenDecimals = presaleData?.token?.decimals ?? 18;
      const presaleAddress = presaleData?.presaleAddr;

      console.log("token Address:", tokenAddress);
      console.log("Token Decimals:", tokenDecimals);
      console.log("Presale Address:", presaleAddress);

      if (!tokenAddress || !presaleAddress) {
        throw new Error("Token or Presale Address missing!");
      }

      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      // Menge berechnen (z. B. Hardcap oder vorher gespeicherte Amounts)
      const fundAmount = ethers.parseUnits(
        presaleData?.token?.tokensForSale?.toString() || "0",
        tokenDecimals
      );
      console.log("Funding Amount (in smallest units):", fundAmount.toString());

      // Transfer starten
      const tx = await tokenContract.transfer(presaleAddress, fundAmount);
      await tx.wait();

      // Success → Speicher resetten und Success-Seite anzeigen
      localStorage.clear();
      navigate("/create-presale/success");
    } catch (err) {
      console.error(err.message);
      alert("Funding transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (!presaleData) {
    return <div className="text-white">Loading presale data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      {/* Stepper, Schritt 4 (Fund) */}
      <Stepper steps={["Details", "Review", "Deploy", "Fund"]} current={3} />

      <div className="mt-12 text-center space-y-6">
        <h2 className="text-white text-3xl font-bold">Fund your Presale</h2>
        <p className="text-gray-400">
          Send{" "}
          <span className="font-semibold text-white">
            {presaleData.token?.symbol}
          </span>{" "}
          tokens to your presale contract.
        </p>

        <div className="bg-[#0C0E13] border border-[#23272F] rounded-xl p-4 text-left space-y-2">
          <p className="text-gray-400">Contract Address:</p>
          <p className="text-white font-mono break-all">
            {presaleData.presaleAddr || "N/A"}
          </p>

          <p className="text-gray-400">Token:</p>
          <p className="text-white font-mono break-all">
            {presaleData.token?.name} ({presaleData.token?.symbol})
          </p>

          <p className="text-gray-400">Amount required:</p>
          <p className="text-white font-semibold">
            {presaleData.token?.tokensForSale} {presaleData.token?.symbol}
          </p>
        </div>

        <button
          onClick={handleFund}
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Funding in progress..." : "Fund Presale"}
        </button>
      </div>
    </div>
  );
}
