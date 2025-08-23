import {useState} from 'react'
import Stepper from '../components/Stepper';
import TokenDetails from "../components/TokenDetails";
import PresaleConfig from "../components/PresaleConfig";
import LivePreview from "../components/LivePreview";

const CreatePresale = () => {

    const steps = ["Token Details", "Presale Details", "Liquidity & Lockup", "Review & Create"];
    const [current, setCurrent] = useState(0);
    const [token, setToken] = useState({});
    const [cfg, setCfg] = useState({});

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <Stepper steps={steps} current={current} onStepClick={(i) => setCurrent(i)} />

      {/* Grid: links Form, rechts Preview */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TokenDetails data={token} onChange={setToken} />
          <PresaleConfig data={cfg} onChange={setCfg} />

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-[#23272F] text-gray-300 hover:bg-[#151821]"
              onClick={() => setCurrent(Math.max(0, current - 1))}
            >
              Back
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-[#00E3A5] text-black font-semibold hover:bg-[#00C896]"
              onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
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
}

export default CreatePresale