import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import CreatePresale from "./pages/CreatePresale";
import Portfolio from "./pages/Portfolio";
import Docs from "./pages/Docs";
import CreatePresaleReview from "./pages/CreatePresaleReview";
import CreateWallet from "./pages/CreateWallet";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, darkTheme, midnightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const config = getDefaultConfig({
    appName: "TokenRhino",
    projectId: "8549ae005ad554c65a8ebccd63670c4c",
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <>
            <NavBar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/create-presale" element={<CreatePresale />} />
                <Route
                  path="/create-presale/review"
                  element={<CreatePresaleReview />}
                />
                <Route
                  path="/create-presale/wallet"
                  element={<CreateWallet />}
                />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/docs" element={<Docs />} />
              </Routes>
            </main>
          </>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
