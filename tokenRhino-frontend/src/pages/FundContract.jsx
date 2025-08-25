import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import { ethers } from "ethers";
import { erc20Abi } from "../abi/erc20Abi"; // standard ERC20 ABI (approve/transfer)

export default function FundContract({ presaleData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    if (!window.ethereum) {
      alert("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // User Token Contract
      const tokenContract = new ethers.Contract(
        presaleData.tokenAddress, // gespeichert aus Step 1
        erc20Abi,
        signer
      );

      // Presale Contract Adresse
      const presaleAddress = presaleData.presaleAddress;
      const fundAmount = ethers.parseUnits(
        presaleData.tokenAmount.toString(),
        presaleData.decimals
      );

      // Transfer Tokens → Presale Contract
      const tx = await tokenContract.transfer(presaleAddress, fundAmount);
      await tx.wait();

      // Success → route zur Success Page
      localStorage.clear();
      navigate("/create/success");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 mt-16">
      <Stepper currentStep={3} />

      <div className="mt-12 text-center space-y-6">
        <h2 className="text-white text-3xl font-bold">Fund your Presale</h2>
        <p className="text-gray-400">
          Send your <span className="font-semibold text-white">{presaleData.tokenSymbol}</span> 
          {" "}tokens to your presale contract.
        </p>

        <div className="bg-[#0C0E13] border border-[#23272F] rounded-xl p-4 text-left space-y-2">
          <p className="text-gray-400">Contract Address:</p>
          <p className="text-white font-mono break-all">{presaleData.presaleAddress}</p>

          <p className="text-gray-400">Token:</p>
          <p className="text-white font-mono break-all">
            {presaleData.tokenName} ({presaleData.tokenSymbol})
          </p>

          <p className="text-gray-400">Amount required:</p>
          <p className="text-white font-semibold">
            {presaleData.tokenAmount} {presaleData.tokenSymbol}
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