// src/pages/CreatePresaleReview.jsx
import { useEffect, useState } from "react";
import Stepper from "../components/Stepper";
import ReviewSummary from "../components/ReviewSummary";
import { validatePresale } from "../lib/validatePresale";
import { useNavigate } from "react-router-dom";

export default function CreatePresaleReview() {
  const navigate = useNavigate();

  // Draft laden (je nach deiner Vorseite hier befüllen)
  const [token, setToken] = useState(() => {
    const s = localStorage.getItem("createDraftToken");
    return s ? JSON.parse(s) : {};
  });
  const [cfg, setCfg] = useState(() => {
    const s = localStorage.getItem("createDraftCfg");
    return s ? JSON.parse(s) : {};
  });

  const [checks, setChecks] = useState({ escrow: false, fees: false });
  const [validation, setValidation] = useState({ issues: [], hasErrors: false, hasWarnings: false });

  useEffect(() => {
    setValidation(validatePresale({ token, cfg }));
  }, [token, cfg]);

  const canContinue = !validation.hasErrors && checks.escrow && checks.fees;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <Stepper steps={["Token & Presale Detauls", "Review", "Funding"]} current={1} />

      <div className="mt-8 grid grid-cols-1 gap-6">
        <ReviewSummary token={token} cfg={cfg} validation={validation} checks={checks} setChecks={setChecks} />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-[#23272F] text-gray-300 hover:bg-[#151821]"
            onClick={() => navigate("/create-presale")}  // zurück zu Formular
          >
            Zurück
          </button>
          <button
            disabled={!canContinue}
            className={`px-5 py-2 rounded-lg font-semibold transition-colors
              ${canContinue ? "bg-[#00E3A5] text-black hover:bg-[#00C896]" : "bg-[#1A1D24] text-gray-500 cursor-not-allowed"}
            `}
            onClick={() => navigate("/create-presale/wallet")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}