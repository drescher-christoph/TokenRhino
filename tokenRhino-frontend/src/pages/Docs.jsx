// src/pages/Docs.jsx
import { Link } from "react-router-dom";

const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
    <div className="text-gray-300 leading-relaxed">{children}</div>
  </section>
);

const Code = ({ children }) => (
  <pre className="bg-[#0C0E13] border border-[#23272F] rounded-xl p-4 overflow-x-auto text-sm text-gray-200">
    <code>{children}</code>
  </pre>
);

export default function Docs() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">TokenRhino Docs</h1>
        <p className="text-gray-400 mt-2">
          Alles, was du für Creator & Contributors wissen musst – kompakt und praxisnah.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/create-presale"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            Create Presale
          </Link>
          <Link
            to="/markets"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
          >
            Explore Markets
          </Link>
        </div>
      </div>

      {/* TOC */}
      <div className="bg-[#0C0E13] border border-[#23272F] rounded-xl p-4 mb-10">
        <p className="text-gray-400 mb-2 text-sm">Inhalt</p>
        <div className="flex flex-wrap gap-3 text-sm">
          {[
            ["overview", "Overview"],
            ["how", "How it works"],
            ["fees", "Fees"],
            ["security", "Security & Risk"],
            ["networks", "Supported Networks"],
            ["contracts", "Smart Contracts"],
            ["creator", "For Creators"],
            ["contributor", "For Contributors"],
            ["faq", "FAQ"],
            ["glossary", "Glossary"],
            ["roadmap", "Roadmap"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        <Section id="overview" title="Overview">
          <p>
            TokenRhino ist eine minimalistische Plattform, um Token-Presales sicher,
            transparent und einfach zu starten. Creator definieren Hardcap/Zeitraum,
            Contributors investieren in ETH, und erhalten nach Finalisierung ihre Tokens.
            <br />
            <br />
            Der MVP fokussiert: faire Preisbildung, klare Regeln (Soft/Hardcap), stabile
            Smart-Contract-Logik (Claim/Refund) und schlanke UX inspiriert von Polymarket & Co.
          </p>
        </Section>

        <Section id="how" title="How it works">
          <ol className="list-decimal ml-5 space-y-2">
            <li>Creator erstellt Presale via Factory (Fee + Presale-Params).</li>
            <li>Contributor investiert in den Presale (ETH).</li>
            <li>Bei Softcap erreicht → Finalisierung → Claim der Tokens.</li>
            <li>Bei Softcap verfehlt → Contributors können Refund ziehen.</li>
            <li>Creator kann nach Finalisierung die Funds withdrawen.</li>
          </ol>
          <Code>{`// Presale Parameter (Beispiel)
{
  tokenAddress: "0xYourToken",
  tokenName: "RHINO",
  tokensForSale: "800000 * 1e18",
  softCapWei: "30 ETH",
  hardCapWei: "50 ETH",
  minContributionWei: "0.05 ETH",
  maxContributionWei: "15 ETH",
  duration: "31 days"
}`}</Code>
        </Section>

        <Section id="fees" title="Fees">
          <ul className="list-disc ml-5 space-y-1">
            <li>Create Fee: <span className="text-gray-200 font-medium">0.01 ETH</span> (bei Presale-Erstellung)</li>
            <li>Platform Fee: <span className="text-gray-200 font-medium">2.5%</span> auf eingehende Contributions</li>
          </ul>
          <p className="mt-3 text-gray-400 text-sm">
            Hinweis: Werte sind MVP-Defaults und können sich ändern.
          </p>
        </Section>

        <Section id="security" title="Security & Risk">
          <ul className="list-disc ml-5 space-y-2">
            <li>Smart Contracts folgen CEI-Pattern + ReentrancyGuard.</li>
            <li>Kein Upgradable Proxy im MVP (Transparenz & Einfachheit).</li>
            <li>Creator müssen Token-Bestand an den Presale vor Go-Live funden.</li>
            <li>
              DYOR: TokenRhino gibt keine Finanz- oder Rechtsberatung. Regionale
              Beschränkungen beachten.
            </li>
          </ul>
        </Section>

        <Section id="networks" title="Supported Networks">
          <ul className="list-disc ml-5">
            <li>Ethereum Sepolia (MVP)</li>
            <li>Optional: Base, Arbitrum, Polygon (Roadmap)</li>
          </ul>
        </Section>

        <Section id="contracts" title="Smart Contracts">
          <p className="mb-3">
            **Factory** und **Presale** sind die Kernverträge. Adressen sind abhängig von Deployments.
          </p>
          <Code>{`// Beispiel (Dummy)
Factory: 0xFaaC...cAFE
Presale (example): 0xDeaD...Beef`}</Code>
          <p className="text-gray-400 text-sm mt-3">
            ABI & genaue Adressen findest du später im "Developers" Abschnitt oder direkt im Repo.
          </p>
        </Section>

        <Section id="creator" title="For Creators (Start a Presale)">
          <ol className="list-decimal ml-5 space-y-2">
            <li>Token bereit: 18 Decimals, totalSupply, Name/Symbol.</li>
            <li>Presale-Parameter definieren (Soft/Hardcap, Dauer, Limits).</li>
            <li>Presale deployen (Create Fee fällig).</li>
            <li>Presale funden (Tokens → Presale Contract).</li>
            <li>Share Link mit Community → Investors können teilnehmen.</li>
          </ol>
        </Section>

        <Section id="contributor" title="For Contributors (Invest, Claim, Refund)">
          <ul className="list-disc ml-5 space-y-2">
            <li>Wallet verbinden, Presale öffnen, Betrag in ETH festlegen.</li>
            <li>Bei Finalisierung (Softcap erreicht) → Claim der Tokens.</li>
            <li>Bei Misserfolg (Softcap verfehlt) → Refund der ETH.</li>
          </ul>
          <p className="text-gray-400 text-sm mt-2">
            Gas-Kosten, Netzwerk-Fees und Slippage sind zu beachten.
          </p>
        </Section>

        <Section id="faq" title="FAQ">
          <p className="mb-2 text-gray-200 font-semibold">Was passiert bei Softcap verfehlt?</p>
          <p className="mb-4">Contributors können ihre Beiträge via Refund zurückholen.</p>
          <p className="mb-2 text-gray-200 font-semibold">Wer legt den Preis fest?</p>
          <p className="mb-4">
            Der effektive Token/ETH-Preis ergibt sich aus <em>tokensForSale / hardCap</em>.
          </p>
          <p className="mb-2 text-gray-200 font-semibold">Wann kann ich claimen?</p>
          <p>Nach Ende + Softcap erreicht → Presale wechselt in CLAIMABLE.</p>
        </Section>

        <Section id="glossary" title="Glossary">
          <ul className="list-disc ml-5 space-y-1">
            <li><b>Softcap</b>: Mindestziel, ab dem der Presale als erfolgreich gilt.</li>
            <li><b>Hardcap</b>: Maximales Funding-Volumen.</li>
            <li><b>Claim</b>: Abholen der gekauften Tokens nach Finalisierung.</li>
            <li><b>Refund</b>: Rückerstattung des Beitrags, wenn Softcap verfehlt.</li>
          </ul>
        </Section>

        <Section id="roadmap" title="Roadmap (MVP ➜ V1)">
          <ul className="list-disc ml-5 space-y-1">
            <li>MVP: ETH only, simple Factory/Presale, Markets/Docs/Portfolio UI.</li>
            <li>V1: USDC Support, Allowlists, The Graph Indexer, Creator Badges.</li>
            <li>V1.1: Multi-chain, Presale verification, On-chain metadata.</li>
          </ul>
        </Section>

        <div className="pt-4">
          <Link
            to="/create-presale"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            Start your Presale
          </Link>
        </div>
      </div>
    </div>
  );
}