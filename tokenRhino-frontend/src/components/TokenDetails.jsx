// components/create/TokenDetails.jsx
import { useRef } from "react";
import Card from "./Card";
import { Field } from "./Field";
import { useImageUpload } from "../hooks/useImageUploads";
import { getIPFSUrl } from "../services/ipfsService";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export default function TokenDetails({ data, onChange }) {
  const fileRef = useRef(null);
  const { uploadImage, uploading, error } = useImageUpload();

  const set = (k, v) => onChange({ ...data, [k]: v });

  // handleFileUpload MUSS innerhalb der Komponente definiert werden
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      set("logoFile", file);
      
      // Temporäre lokale URL für Preview
      const tempUrl = URL.createObjectURL(file);
      set("logoUrl", tempUrl);
      
      // Upload zu IPFS
      const result = await uploadImage(file, {
        name: `${data.name || 'token'}-logo`
      });
      
      // IPFS URL speichern
      set("logoUrl", result.ipfsUrl);
      set("logoIpfsHash", result.ipfsHash);
      
      // Temporäre URL freigeben
      URL.revokeObjectURL(tempUrl);
    } catch (err) {
      console.error('Upload fehler:', err);
      // Fallback zur lokalen URL
      set("logoUrl", URL.createObjectURL(file));
    }
  };

  return (
    <Card title="Token Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Token Name">
          <input
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.name || ""}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. TokenRhino"
          />
        </Field>

        <Field label="Symbol">
          <input
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.symbol || ""}
            onChange={(e) => set("symbol", e.target.value)}
            placeholder="e.g. RHINO"
          />
        </Field>

        <Field label="Tokens for Sale (units)">
          <input
            type="number"
            min="0"
            step="1e18"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.tokensForSale || ""}
            onChange={(e) => set("tokensForSale", e.target.value)}
            placeholder="800000 * 1e18"
          />
        </Field>

        <Field label="Token Address (ERC20)">
          <input
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.tokenAddress || ""}
            onChange={(e) => set("tokenAddress", e.target.value)}
            placeholder="0x..."
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Logo" hint="PNG/SVG, quadratisch empfohlen (max. 10MB)">
            <div
              className={`flex items-center gap-3 bg-[#151821] border border-dashed border-[#2F333D] rounded-lg px-3 py-3 cursor-pointer ${
                uploading ? 'opacity-50' : ''
              }`}
              onClick={() => !uploading && fileRef.current?.click()}
            >
              {data.logoUrl ? (
                <img
                  src={getIPFSUrl(data.logoUrl)}
                  alt="Logo"
                  className="w-10 h-10 rounded-full border border-[#23272F] object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1A1F29] border border-[#23272F]" />
              )}
              <div className="text-sm text-gray-400">
                {uploading 
                  ? "Uploading zu IPFS..." 
                  : data.logoFile?.name || "Klicke zum Hochladen"
                }
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
            {data.logoIpfsHash && (
              <p className="text-green-400 text-sm mt-1">
                ✓ Erfolgreich auf IPFS hochgeladen
              </p>
            )}
          </Field>
        </div>

        {/* Socials */}
        <Field label="Website (optional)">
          <input
            type="url"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.website || ""}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://myproject.com"
          />
        </Field>

        <Field label="Twitter (optional)">
          <input
            type="url"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.twitter || ""}
            onChange={(e) => set("twitter", e.target.value)}
            placeholder="https://twitter.com/myproject"
          />
        </Field>

        <Field label="Telegram (optional)">
          <input
            type="url"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.telegram || ""}
            onChange={(e) => set("telegram", e.target.value)}
            placeholder="https://t.me/myproject"
          />
        </Field>

        <Field label="Discord (optional)">
          <input
            type="url"
            className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
            value={data.discord || ""}
            onChange={(e) => set("discord", e.target.value)}
            placeholder="https://discord.gg/myproject"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Beschreibung">
            <textarea
              rows={4}
              className="w-full bg-[#151821] border border-[#23272F] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00E3A5]"
              value={data.description || ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Kurze Projektbeschreibung..."
            />
          </Field>
        </div>
      </div>
    </Card>
  );
}