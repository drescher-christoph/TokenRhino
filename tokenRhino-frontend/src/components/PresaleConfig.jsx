// components/create/PresaleConfig.jsx
import Card from "./Card";
import { Field } from "./Field";

export default function PresaleConfig({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <Card title="Presale Configuration">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Hard Cap (ETH)">
          <input type="number" min="0" step="0.01"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.hardCap || ""} onChange={(e) => set("hardCap", e.target.value)}
            placeholder="50"
          />
        </Field>

        <Field label="Soft Cap (ETH)">
          <input type="number" min="0" step="0.01"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.softCap || ""} onChange={(e) => set("softCap", e.target.value)}
            placeholder="30"
          />
        </Field>

        <Field label="Min Contribution (ETH)">
          <input type="number" min="0" step="0.001"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.minContrib || ""} onChange={(e) => set("minContrib", e.target.value)}
            placeholder="0.05"
          />
        </Field>

        <Field label="Max Contribution (ETH, 0 = no limit)">
          <input type="number" min="0" step="0.001"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.maxContrib || ""} onChange={(e) => set("maxContrib", e.target.value)}
            placeholder="15"
          />
        </Field>

        <Field label="Start">
          <input type="datetime-local"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.start || ""} onChange={(e) => set("start", e.target.value)}
          />
        </Field>

        <Field label="End">
          <input type="datetime-local"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.end || ""} onChange={(e) => set("end", e.target.value)}
          />
        </Field>
      </div>
    </Card>
  );
}