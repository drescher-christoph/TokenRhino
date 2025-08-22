import { useState } from "react";
import NavBar from "./sections/NavBar";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Dashboard from "./sections/Dashboard";

function App() {

  return (
    <>
      <NavBar />
      <main>
        <Dashboard />
      </main>
    </>
  );
}

export default App;
