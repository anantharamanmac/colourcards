import React from "react";

function Card({ card, onClick }) {
  // Make yellow cards visible by changing text color
  const textColor = card.color === "yellow" ? "black" : "white";

  // Add a simple border pattern
  const cardStyle = {
    backgroundColor: card.color,
    color: textColor,
    border: "3px solid white",
    borderRadius: "12px",
    width: "70px",
    height: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    position: "relative",
  };

  // Optional pattern for number cards
  const pattern = card.value.length === 1 ? "•" : "";

  return (
    <div style={cardStyle} onClick={() => onClick(card)}>
      <div style={{ fontSize: "14px" }}>{card.value}</div>
      <div style={{ fontSize: "24px" }}>{pattern}</div>
      <div style={{ fontSize: "14px" }}>{card.value}</div>
    </div>
  );
}

export default Card;
