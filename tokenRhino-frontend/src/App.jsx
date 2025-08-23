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


function App() {

  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/create-presale" element={<CreatePresale />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
