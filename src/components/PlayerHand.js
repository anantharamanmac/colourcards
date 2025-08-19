import React from "react";

function PlayerHand({ hand, onCardClick, dealAnimation, renderCard }) {
  return (
    <div className="player-hand">
      <h3>Your Hand:</h3>
      <div className="hand">
        {hand.map((card, idx) => (
          <div
            key={idx}
            className={dealAnimation ? "deal-animation" : ""}
            onClick={() => onCardClick(card)}
            style={{ cursor: "pointer" }}
          >
            {renderCard(card)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerHand;
