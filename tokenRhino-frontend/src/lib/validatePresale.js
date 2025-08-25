// src/lib/validatePresale.js
export function toWeiEth(x) {
  const n = Number(x);
  if (!isFinite(n) || n < 0) return null;
  return BigInt(Math.round(n * 1e18));
}

export function validatePresale({ token = {}, cfg = {} }) {
  const issues = []; // {level: 'error'|'warn', msg: string}

  // Basics
  if (!token.name || token.name.trim().length < 2)
    issues.push({ level: "error", msg: "Token name fehlt oder ist zu kurz." });
  if (!token.symbol || token.symbol.trim().length < 2)
    issues.push({ level: "error", msg: "Token symbol fehlt oder ist zu kurz." });
  if (!token.tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(token.tokenAddress || ""))
    issues.push({ level: "warn", msg: "Token Address scheint ungültig zu sein (0x...). Für Test ok." });

  // Mengen
  const tokensForSale = Number(token.tokensForSale || 0);
  if (!(tokensForSale > 0)) issues.push({ level: "error", msg: "Tokens for Sale muss > 0 sein." });

  // Caps
  const hard = Number(cfg.hardCap || 0);
  const soft = Number(cfg.softCap || 0);
  const minC = Number(cfg.minContrib || 0);
  const maxC = Number(cfg.maxContrib || 0);

  if (!(hard > 0)) issues.push({ level: "error", msg: "Hard Cap (ETH) muss > 0 sein." });
  if (!(soft > 0)) issues.push({ level: "warn", msg: "Soft Cap ist 0 – Refund-Logik entfällt." });
  if (soft > hard) issues.push({ level: "error", msg: "Soft Cap darf Hard Cap nicht übersteigen." });

  if (maxC > 0 && minC > maxC) issues.push({ level: "error", msg: "Min Contribution darf Max Contribution nicht übersteigen." });

  // Zeiten
  const start = cfg.start ? new Date(cfg.start) : null;
  const end = cfg.end ? new Date(cfg.end) : null;
  if (!start || !end) {
    issues.push({ level: "error", msg: "Start und End müssen gesetzt sein." });
  } else {
    if (!(end > start)) issues.push({ level: "error", msg: "Ende muss nach Start liegen." });
    const now = new Date();
    if (start < now) issues.push({ level: "warn", msg: "Start liegt in der Vergangenheit – Presale startet sofort." });
    const durH = (end - (start || end)) / (1000 * 60 * 60);
    if (durH < 1) issues.push({ level: "warn", msg: "Sehr kurze Laufzeit (<1h)." });
  }

  // Preisauflösung
  if (hard > 0 && tokensForSale > 0) {
    const tokensPerEth = tokensForSale / hard; // nur Anzeige (human)
    if (tokensPerEth <= 0) issues.push({ level: "error", msg: "Preisauflösung zu klein – prüfe Tokens for Sale und Hard Cap." });
  }

  const hasErrors = issues.some(i => i.level === "error");
  const hasWarnings = issues.some(i => i.level === "warn");
  return { issues, hasErrors, hasWarnings };
}