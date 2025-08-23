// components/create/TokenDetails.jsx
import { useRef } from "react";
import Card from "./Card";
import { Field } from "./Field";

export default function TokenDetails({ data, onChange }) {
  const fileRef = useRef(null);

  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <Card title="Token Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Token Name">
          <input
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.name || ""} onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. TokenRhino"
          />
        </Field>

        <Field label="Symbol">
          <input
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.symbol || ""} onChange={(e) => set("symbol", e.target.value)}
            placeholder="e.g. RHINO"
          />
        </Field>

        <Field label="Tokens for Sale (units)">
          <input
            type="number" min="0" step="1e18"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.tokensForSale || ""} onChange={(e) => set("tokensForSale", e.target.value)}
            placeholder="800000 * 1e18"
          />
        </Field>

        <Field label="Token Address (ERC20)">
          <input
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.tokenAddress || ""} onChange={(e) => set("tokenAddress", e.target.value)}
            placeholder="0x..."
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Logo" hint="PNG/SVG, quadratisch empfohlen">
            <div
              className="flex items-center gap-3 bg-[#151821] border border-dashed border-[#2F333D] rounded-lg px-3 py-3"
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-10 h-10 rounded-full bg-[#1A1F29] border border-[#23272F]" />
              <div className="text-sm text-gray-400">
                {data.logoFile?.name || "Klicke zum Hochladen"}
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden
                onChange={(e) => set("logoFile", e.target.files?.[0])} />
            </div>
          </Field>
        </div>
      </div>
    </Card>
  );
}