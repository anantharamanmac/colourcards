import React, { useState } from "react";
import "./StartingPage.css";

function StartingPage({ onStart }) {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="starting-screen">
      <h1>ColourCard Game</h1>
      <div className="card-shuffle-animation">
        {/* Optional: add card animation here */}
      </div>

      <div className="buttons-container">
        <button className="start-game-button" onClick={onStart}>
          Start Game
        </button>
        <button className="rules-button" onClick={() => setShowRules(true)}>
          Rules
        </button>
      </div>

      {showRules && (
        <div className="rules-modal">
          <div className="rules-content">
            <h2>Game Rules</h2>
            <ul>
              <li>Each player is dealt 7 cards at the start.</li>
              <li>Match cards by color, number, or symbol.</li>
              <li>Special cards: Skip, Reverse, +2, Wild, Wild +4.</li>
              <li>When you have one card left, press "Declare UNO".</li>
              <li>If you fail to declare UNO, you must draw a penalty card.</li>
              <li>The first player to empty their hand wins!</li>
            </ul>
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartingPage;
