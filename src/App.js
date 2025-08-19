import React, { useState } from "react";
import GameBoard from "./components/GameBoard";
import GameLoader from "./components/GameLoader";
import "./styles.css";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {!started && <GameLoader onStart={() => setStarted(true)} />}
      {started && <GameBoard />}
    </>
  );
}

export default App;
