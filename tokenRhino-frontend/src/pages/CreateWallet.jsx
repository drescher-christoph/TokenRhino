import { useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { useNavigate } from "react-router-dom";
import { PresaleFactoryAbi } from "../abi/PresaleFactory";
import Stepper from "../components/Stepper";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DeployingAnimation from "../components/DeployingAnimation";

// === CONFIG ===
const FACTORY_ADDRESS = "0x8DBF8B55F53667726C0764f50179409Fd9245e5C";
const REQUIRED_CHAIN_ID = 11155111; // z.B. Sepolia
const CREATE_FEE_ETH = "0.01";

// localStorage keys (wie zuvor)
const LS_TOKEN = "createDraftToken";
const LS_CFG = "createDraftCfg";

// Hilfsfunktionen
function readDraft(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function toBigIntUnits(str) {
  // Erwartet String einer ganzen Zahl (wei/unterschiedliche Einheiten).
  // Für TokensForSale (bereits in 18-decimal "units") nehmen wir BigInt direkt.
  if (!str) return 0n;
  const s = String(str).trim();
  if (!/^\d+$/.test(s))
    throw new Error("TokensForSale muss als ganze Zahl (Einheiten) vorliegen.");
  return BigInt(s);
}

function toWeiOrZero(x) {
  const v = String(x ?? "").trim();
  if (v === "" || Number(v) === 0) return 0n;
  return parseEther(v); // viem: string -> wei (BigInt)
}

export default function CreateWallet() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({
    address,
    query: { enabled: !!address },
  });

  // Drafts lesen
  const token = useMemo(() => readDraft(LS_TOKEN, {}), []);
  const cfg = useMemo(() => readDraft(LS_CFG, {}), []);

  // Argumente für den Factory-Call vorbereiten
  const argsOrError = useMemo(() => {
    try {
      const tokenAddress = token.tokenAddress;
      const tokenName = token.name ?? "";
      const tokenSupplyInUnits = toBigIntUnits(token.tokensForSale); // bereits 18-decimal units
      const hardCapWei = toWeiOrZero(cfg.hardCap);
      const softCapWei = toWeiOrZero(cfg.softCap);
      const minContribWei = toWeiOrZero(cfg.minContrib);
      const maxContribWei = toWeiOrZero(cfg.maxContrib);

      if (!tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress))
        throw new Error("Ungültige Token-Adresse.");
      if (!tokenName || tokenName.length < 2)
        throw new Error("Token Name fehlt/zu kurz.");
      if (tokenSupplyInUnits <= 0n)
        throw new Error("TokensForSale muss > 0 sein.");
      if (hardCapWei <= 0n) throw new Error("Hard Cap muss > 0 sein.");
      if (softCapWei > hardCapWei)
        throw new Error("Soft Cap darf Hard Cap nicht übersteigen.");

      return {
        ok: true,
        args: [
          tokenAddress,
          tokenName,
          tokenSupplyInUnits,
          hardCapWei,
          softCapWei,
          minContribWei,
          maxContribWei,
        ],
      };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, [token, cfg]);

  // wagmi: write + receipt
  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: waiting,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  });

  // Deployment auslösen
  const [uiError, setUiError] = useState("");

  const canPay =
    isConnected &&
    chainId === REQUIRED_CHAIN_ID &&
    Number(balance?.value ?? 0n) >= Number(parseEther(CREATE_FEE_ETH));

  const onDeploy = async () => {
    setUiError("");
    if (!argsOrError.ok) {
      setUiError(argsOrError.error);
      return;
    }
    if (!isConnected) {
      setUiError("Bitte Wallet verbinden.");
      return;
    }
    if (chainId !== REQUIRED_CHAIN_ID) {
      setUiError("Falsche Chain. Bitte wechseln.");
      return;
    }
    if (!canPay) {
      setUiError("Nicht genug ETH für 0.01 Create-Fee + Gas.");
      return;
    }

    try {
      writeContract({
        address: FACTORY_ADDRESS,
        abi: PresaleFactoryAbi,
        functionName: "createPresale",
        args: argsOrError.args,
        value: parseEther(CREATE_FEE_ETH), // 0.01 ETH
      });
    } catch (err) {
      setUiError(err?.shortMessage || err?.message || "Send failed");
    }
  };

  // Nach Erfolg: Presale-Adresse aus Event extrahieren (wenn Factory returned address, brauchst du das nicht)
  if (isSuccess && receipt) {
    try {
      // Versuch 1: Rückgabewert (falls dein ABI "returns (address)" liefert, wagmi gibt das NICHT direkt hier)
      // Daher: Versuch 2: Event dekodieren
      const logs = receipt.logs || [];
      const iface = new InterfaceLike(PresaleFactoryAbi); // wir bauen eine Mini-Deko unten
      const ev = findPresaleCreated(logs, iface);
      const presaleAddr = ev?.args?.presale;
      if (presaleAddr) {
        navigate(`/create-presale/fund?addr=${presaleAddr}`);
      } else {
        navigate(`/create-presale/fund?tx=${txHash}`); // Fallback, falls Event nicht geparst wird
      }
    } catch {
      navigate(`/create-presale/fund?tx=${txHash}`);
    }
  }

  // Mini „InterfaceLike“ fürs Event-Decoding ohne extra Lib (quick & dirty über viem)
  function InterfaceLike(abi) {
    return { abi };
  }
  function findPresaleCreated(logs, iface) {
    // viem kann Events decoden, aber um es simpel zu halten:
    // Suche den Log mit dem richtigen Topic (Event-Signatur)
    const sig = "PresaleCreated(address,address,address)";
    // viem utils: keccak256 of signature → topic0 (hier sparen wir's uns; in echt: use decodeEventLog from viem)
    // Für MVP: lass den Fallback mit ?tx=hash greifen, oder ersetze diese Funktion
    return null;
  }

  // UI
  const wrongChain = isConnected && chainId !== REQUIRED_CHAIN_ID;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <Stepper steps={["Details", "Review", "Deploy", "Fund"]} current={2} />
      <div className="mt-8 max-w-2xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-4">Connect & Deploy</h1>

        {waiting ? (
            <>
            <DeployingAnimation />
            </>
        ) : (
            <div className="space-y-3 text-sm">
          <Row label="Wallet">
            {isConnected ? (
              <span className="text-[#00E3A5]">
                Connected: {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
            ) : (
              <span className="text-red-400">Not connected</span>
            )}
          </Row>
          <Row label="Network">
            {wrongChain ? (
              <button
                className="px-3 py-1.5 rounded-md bg-[#23272F] border border-[#2F333D] text-white hover:border-[#00E3A5]"
                onClick={() => switchChain?.({ chainId: REQUIRED_CHAIN_ID })}
              >
                Switch to {REQUIRED_CHAIN_ID}
              </button>
            ) : (
              <span className="text-gray-300">{chainId ?? "—"}</span>
            )}
          </Row>
          <Row label="Balance">
            <span className="text-gray-300">
              {balance
                ? `${balance.formatted.slice(0, 6)} ${balance.symbol}`
                : "—"}
            </span>
          </Row>
          <Row label="Create Fee">
            <span className="text-gray-300">{CREATE_FEE_ETH} ETH + Gas</span>
          </Row>
        </div>
        )}

        {uiError && (
          <div className="mt-4 rounded-xl border border-[#5A0F1F] bg-[#3B0B17] text-[#FF4E6D] px-4 py-3 text-sm">
            {uiError}
          </div>
        )}
        {writeError && (
          <div className="mt-3 rounded-xl border border-[#5A0F1F] bg-[#3B0B17] text-[#FF4E6D] px-4 py-3 text-sm">
            {writeError.shortMessage || writeError.message}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {!isConnected ? (
            //   <ConnectButton />
            <span className="text-gray-400 text-sm">
              Bitte oben in der Navbar „Connect Wallet“ klicken.
            </span>
          ) : (
            <button
              onClick={onDeploy}
              disabled={isPending || waiting || !canPay}
              className={`px-5 py-2 rounded-lg font-semibold transition-colors
              ${
                isPending || waiting || !canPay
                  ? "bg-[#1A1D24] text-gray-500 cursor-not-allowed"
                  : "bg-[#00E3A5] text-black hover:bg-[#00C896]"
              }`}
            >
              {isPending || waiting ? "Deploying…" : "Pay 0.01 ETH & Deploy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// kleine UI-Zeile
function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between bg-[#0C0E13] border border-[#23272F] rounded-lg px-4 py-3">
      <span className="text-gray-400">{label}</span>
      <div>{children}</div>
    </div>
  );
}
