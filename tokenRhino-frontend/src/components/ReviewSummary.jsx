// src/components/create/ReviewSummary.jsx
import Card from "./Card";
import Alert from "./Alert";
import useLocalStorage from "../hooks/useLocalStorage";
import { LS_TOKEN, LS_CFG } from "../lib/createKeys";

export default function ReviewSummary({
  validation,
  checks,
  setChecks,
}) {

  const [token] = useLocalStorage(LS_TOKEN, {});
  const [cfg] = useLocalStorage(LS_CFG, {});

  const hard = Number(cfg.hardCap || 0);
  const tokensForSale = Number(token.tokensForSale || 0);
  const tokensPerEth = hard > 0 ? tokensForSale / hard : 0;
  const start = cfg.start ? new Date(cfg.start) : null;
  const end = cfg.end ? new Date(cfg.end) : null;

  return (
    <Card title="Review">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0F1117] border border-[#23272F] rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">Token</div>
          <div className="text-white font-semibold">
            {token.name || "-"}{" "}
            <span className="text-gray-500">· {token.symbol || "-"}</span>
          </div>
          <div className="text-sm text-gray-400 break-all mt-1">
            {token.tokenAddress || "0x..."}
          </div>
          <div className="text-sm text-gray-300 mt-2">
            Tokens for Sale:{" "}
            <span className="text-white">{tokensForSale || 0}</span>
          </div>
          <div className="text-sm text-gray-300">
            ≈ Tokens/ETH:{" "}
            <span className="text-white">
              {tokensPerEth ? tokensPerEth.toLocaleString() : "-"}
            </span>
          </div>
        </div>

        <div className="bg-[#0F1117] border border-[#23272F] rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">Presale</div>
          <div className="text-sm text-gray-300">
            Hard Cap: <span className="text-white">{cfg.hardCap || 0} ETH</span>
          </div>
          <div className="text-sm text-gray-300">
            Soft Cap: <span className="text-white">{cfg.softCap || 0} ETH</span>
          </div>
          <div className="text-sm text-gray-300">
            Min/Max:{" "}
            <span className="text-white">
              {cfg.minContrib || 0} – {cfg.maxContrib || 0} ETH
            </span>
          </div>
          <div className="text-sm text-gray-300">
            Start:{" "}
            <span className="text-white">
              {start ? start.toLocaleString() : "-"}
            </span>
          </div>
          <div className="text-sm text-gray-300">
            End:{" "}
            <span className="text-white">
              {end ? end.toLocaleString() : "-"}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Fees:{" "}
            <span className="text-white font-medium">0.01 ETH create</span> +{" "}
            <span className="text-white font-medium">2.5% per buy</span>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="mt-4 space-y-2">
        {validation.issues.map((i, idx) => (
          <Alert key={idx} kind={i.level === "error" ? "error" : "warn"}>
            {i.msg}
          </Alert>
        ))}
        {validation.issues.length === 0 && (
          <Alert kind="success">Alle Checks sehen gut aus.</Alert>
        )}
      </div>

      {/* Confirmations */}
      <div className="mt-4 space-y-3">
        <label className="flex items-start gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            className="mt-1"
            checked={checks.escrow || false}
            onChange={(e) =>
              setChecks((c) => ({ ...c, escrow: e.target.checked }))
            }
          />
          <span>
            Ich bestätige, dass ich die <b>Tokens for Sale</b> in den
            Presale-Contract einzahle (Escrow), damit Käufer später claimen
            können.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            className="mt-1"
            checked={checks.fees || false}
            onChange={(e) =>
              setChecks((c) => ({ ...c, fees: e.target.checked }))
            }
          />
          <span>
            Ich akzeptiere die Plattformgebühren: <b>0.01 ETH</b> bei Erstellung
            + <b>2.5%</b> pro Kauf.
          </span>
        </label>
      </div>
    </Card>
  );
}
