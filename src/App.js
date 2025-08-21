import React, { useState } from "react";
import GameBoard from "./components/GameBoard";
import GameLoader from "./components/GameLoader";
import StartingPage from "./components/StartingPage";
import "./styles.css";

function App() {
  const [loaderFinished, setLoaderFinished] = useState(false);
  const [started, setStarted] = useState(false);

  return (
    <>
      {/* Step 1: Show loader first */}
      {!loaderFinished && <GameLoader onStart={() => setLoaderFinished(true)} />}

      {/* Step 2: After loader, show starting page */}
      {loaderFinished && !started && (
        <StartingPage onStart={() => setStarted(true)} />
      )}

      {/* Step 3: After starting page, show game */}
      {started && <GameBoard />}
    </>
  );
}

export default App;
