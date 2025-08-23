// components/create/LivePreview.jsx
import Card from "./Card";

function pct(n) { return isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0; }

export default function LivePreview({ token, cfg }) {
  const hard = parseFloat(cfg.hardCap || 0);
  const soft = parseFloat(cfg.softCap || 0);
  const minC = parseFloat(cfg.minContrib || 0);
  const maxC = parseFloat(cfg.maxContrib || 0);
  const tokensForSale = parseFloat(token.tokensForSale || 0);

  // simple projection: tokens per ETH = (tokensForSale * 1e18) / (hardCapWei) -> hier nur als Verhältnis
  const tokensPerEth = hard > 0 ? tokensForSale / hard : 0;

  const progressSoft = pct((soft / hard) * 100);
  const feeBps = 250; // 2.5% platform fee (Anzeige)
  const createFee = 0.01; // ETH

  return (
    <Card title="Live Preview" className="sticky top-28">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#1A1F29] border border-[#23272F]" />
        <div>
          <div className="text-white font-semibold">{token.name || "Token Name"} <span className="text-gray-400">· {token.symbol || "SYMB"}</span></div>
          <div className="text-xs text-gray-400">Address: {token.tokenAddress || "0x..."}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-[#0F1117] border border-[#23272F] rounded-lg p-3">
          <div className="text-gray-400">Hard Cap</div>
          <div className="text-white font-semibold">{hard || 0} ETH</div>
        </div>
        <div className="bg-[#0F1117] border border-[#23272F] rounded-lg p-3">
          <div className="text-gray-400">Soft Cap</div>
          <div className="text-white font-semibold">{soft || 0} ETH</div>
        </div>
        <div className="bg-[#0F1117] border border-[#23272F] rounded-lg p-3">
          <div className="text-gray-400">Min / Max</div>
          <div className="text-white font-semibold">{minC || 0} — {maxC || 0} ETH</div>
        </div>
        <div className="bg-[#0F1117] border border-[#23272F] rounded-lg p-3">
          <div className="text-gray-400">Tokens/ETH (approx.)</div>
          <div className="text-white font-semibold">{tokensPerEth ? tokensPerEth.toLocaleString() : "-"}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Soft Cap Target</span><span>{progressSoft}%</span>
        </div>
        <div className="w-full bg-[#1A1D24] rounded-full h-2">
          <div className="bg-[#00E3A5] h-2 rounded-full" style={{ width: `${progressSoft}%` }} />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Platform fees: <span className="text-white font-medium">{(feeBps/100).toFixed(2)}%</span> per investment · Create fee: <span className="text-white font-medium">{createFee} ETH</span>
      </div>
    </Card>
  );
}