import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import TokenDetails from "../components/TokenDetails";
import PresaleConfig from "../components/PresaleConfig";
import LivePreview from "../components/LivePreview";
import useLocalStorage from "../hooks/useLocalStorage";
import { LS_TOKEN, LS_CFG, clearCreateDraft } from "../lib/createKeys";

const CreatePresale = () => {
  const navigate = useNavigate();

  const steps = ["Token & Presale Details", "Review", "Review & Create"];
  const [current, setCurrent] = useState(0);
  const [token, setToken] = useLocalStorage(LS_TOKEN, {
    name: "",
    symbol: "",
    tokensForSale: "",
    tokenAddress: "",
    logoFile: null,
    logoUrl: "",
    logoIpfsHash: "", 
    logoGatewayUrl: "", 
    uploadError: "",    
    website: "",
    description: "",
    twitter: "",
    telegram: "",
    discord: "",
  });

  const [cfg, setCfg] = useLocalStorage(LS_CFG, {
    hardCap: "",
    softCap: "",
    minContrib: "",
    maxContrib: "",
    start: "",
    end: "",
  });

  const goReview = () => {
    // Optional: minimale Vorvalidierung
    if (!token.name || !token.symbol || !cfg.hardCap) {
      // simple Hinweis – du kannst hier auch ein Toast nutzen
      alert("Bitte mindestens Token Name, Symbol und Hard Cap ausfüllen.");
      return;
    }
    // Daten liegen bereits im localStorage → weiter
    navigate("/create-presale/review");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <Stepper steps={["Details", "Review", "Deploy", "Funding"]} current={1} />

      {/* Grid: links Form, rechts Preview */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TokenDetails data={token} onChange={setToken} />
          <PresaleConfig data={cfg} onChange={setCfg} />

          <div className="flex justify-end gap-3">
            {/* Reset Button */}
            <button
              className="px-4 py-2 rounded-lg border border-[#23272F] text-gray-300 hover:bg-[#151821]"
              onClick={() => {
                clearCreateDraft();
                setToken({});
                setCfg({});
              }}
            >
              Reset
            </button>

            <button
              className="px-4 py-2 rounded-lg border border-[#23272F] text-gray-300 hover:bg-[#151821]"
              onClick={() => setCurrent(Math.max(0, current - 1))}
            >
              Back
            </button>

            <button
              className="px-5 py-2 rounded-lg bg-[#00E3A5] text-black font-semibold hover:bg-[#00C896]"
              onClick={goReview}
            >
              Continue
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <LivePreview token={token} cfg={cfg} />
        </div>
      </div>
    </div>
  );
};

export default CreatePresale;
