import React, { useState, useEffect } from "react";
import PlayerHand from "./PlayerHand";
import Toast from "./Toast";
import "./GameBoard.css";

const colors = ["red", "yellow", "green", "blue"];
const values = ["0","1","2","3","4","5","6","7","8","9","Skip","Reverse","+2"];
const wildCards = ["Wild", "Wild +4"];

function generateDeck() {
  let deck = [];
  colors.forEach(color => {
    values.forEach(value => {
      deck.push({ color, value });
      if (value !== "0") deck.push({ color, value });
    });
  });
  wildCards.forEach(value => {
    for (let i = 0; i < 4; i++) deck.push({ color: "black", value });
  });
  return deck.sort(() => Math.random() - 0.5);
}

function GameBoard() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("player");
  const [dealAnimation, setDealAnimation] = useState(true);
  const [playerDeclaredLast, setPlayerDeclaredLast] = useState(false);
  const [computerDeclaredLast, setComputerDeclaredLast] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [unoPopup, setUnoPopup] = useState(false);
  const [selectColor, setSelectColor] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState(null);
  const [pendingDraw, setPendingDraw] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    const newDeck = generateDeck();
    setDiscardPile([newDeck[0]]);
    dealCards(newDeck.slice(1));
  }, []);

  const dealCards = (deckCopy) => {
    let player = [];
    let computer = [];
    let tempDeck = [...deckCopy];

    for (let i = 0; i < 7; i++) {
      setTimeout(() => { player.push(tempDeck.shift()); setPlayerHand([...player]); }, i * 200);
      setTimeout(() => { computer.push(tempDeck.shift()); setComputerHand([...computer]); }, i * 200 + 100);
    }

    setTimeout(() => { setDeck(tempDeck); setDealAnimation(false); }, 7 * 200 + 150);
  };

  const checkGameOver = () => {
    if (playerHand.length === 0) { setGameOver(true); addToast("You Win!", "success"); return true; }
    if (computerHand.length === 0) { setGameOver(true); addToast("Computer Wins!", "error"); return true; }
    if (deck.length === 0) {
      setGameOver(true);
      if (playerHand.length < computerHand.length) addToast(`Deck empty! You win with fewer cards (${playerHand.length} vs ${computerHand.length})`, "success");
      else if (computerHand.length < playerHand.length) addToast(`Deck empty! Computer wins with fewer cards (${computerHand.length} vs ${playerHand.length})`, "error");
      else addToast("Deck empty! It's a draw!", "info");
      return true;
    }
    return false;
  };

  const drawCard = (player = "player", count = 1) => {
    if (gameOver) return;
    if (deck.length === 0) { checkGameOver(); return; }
    const drawnCards = deck.slice(0, count);
    setDeck(deck.slice(count));

    if (player === "player") {
      if (hasDrawn) return;
      setPlayerHand(prev => [...prev, ...drawnCards]);
      setHasDrawn(true);
      setCurrentTurn("computer");
      addToast(`You drew ${count} card(s)`, "info");
    } else {
      setComputerHand(prev => [...prev, ...drawnCards]);
      addToast(`Computer drew ${count} card(s)`, "info");
    }

    if (deck.length - count <= 0) setTimeout(checkGameOver, 100);
  };

  useEffect(() => { if (currentTurn === "player") setHasDrawn(false); }, [currentTurn]);

  const applyActionCard = (card, nextPlayer) => {
    if (card.value === "+2") drawCard(nextPlayer, 2);
    else if (card.value === "Skip") setCurrentTurn(currentTurn);
    else if (card.value === "Reverse") setCurrentTurn(currentTurn);
    else setCurrentTurn(nextPlayer);
  };

  const handlePlayerCard = (card) => {
    if (gameOver || selectColor) return;
    const topCard = discardPile[discardPile.length - 1];

    if (pendingDraw > 0 && card.value !== "Wild +4") {
      addToast(`You must draw ${pendingDraw} cards!`, "error");
      drawCard("player", pendingDraw);
      setPendingDraw(0);
      setCurrentTurn("computer");
      return;
    }

    if (card.color === topCard.color || card.value === topCard.value || card.color === "black") {
      const willHaveOneCard = playerHand.length === 2;

      if (card.value === "Wild +4") {
        setPendingDraw(pendingDraw + 4); setPendingWildCard(card); setSelectColor(true); setPlayerHand(playerHand.filter(c => c !== card)); return;
      }

      if (card.color === "black") { setPendingWildCard(card); setSelectColor(true); setPlayerHand(playerHand.filter(c => c !== card)); return; }

      setDiscardPile([...discardPile, card]); setPlayerHand(playerHand.filter(c => c !== card));
      if (checkGameOver()) return;
      if (willHaveOneCard && !playerDeclaredLast) { setUnoPopup(true); setTimeout(() => setUnoPopup(false), 1500); }
      setPlayerDeclaredLast(false); applyActionCard(card, "computer");
      addToast(`You played ${card.value}`, "success");
    }
  };

  const declareUNO = () => { setPlayerDeclaredLast(true); setUnoPopup(false); addToast("You declared UNO!", "success"); };

  useEffect(() => {
    if (currentTurn === "computer" && !dealAnimation && !gameOver) {
      setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1];

        if (pendingDraw > 0) {
          const playable = computerHand.find(c => c.value === "Wild +4");
          if (playable) { setDiscardPile([...discardPile, playable]); setComputerHand(computerHand.filter(c => c !== playable)); setPendingDraw(pendingDraw + 4); playable.color = colors[Math.floor(Math.random() * colors.length)]; applyActionCard(playable, "player"); }
          else { drawCard("computer", pendingDraw); setPendingDraw(0); setCurrentTurn("player"); }
          return;
        }

        const playable = computerHand.find(c => c.color === topCard.color || c.value === topCard.value || c.color === "black");
        if (computerHand.length === 2 && !computerDeclaredLast) { if (Math.random() < 0.5) drawCard("computer", 1); setComputerDeclaredLast(true); }
        else if (computerHand.length === 1) setComputerDeclaredLast(true);

        if (playable) { if (playable.color === "black") playable.color = colors[Math.floor(Math.random() * colors.length)]; setDiscardPile([...discardPile, playable]); setComputerHand(computerHand.filter(c => c !== playable)); if (!checkGameOver()) applyActionCard(playable, "player"); }
        else { drawCard("computer", 1); if (!checkGameOver()) setCurrentTurn("player"); }

      }, 1000);
    }
  }, [currentTurn, discardPile, computerHand, deck, dealAnimation, computerDeclaredLast, pendingDraw, gameOver]);

  const renderCard = (card, hideValue = false) => (
    <div className={`card ${card.color} ${hideValue ? "card-back" : ""}`}>
      {!hideValue && <span className="card-value">{card.value}</span>}
    </div>
  );

  return (
    <div className="game-board">
      <h2>UNO Game</h2>

      <div className="computer-hand">
        <p>Computer: {computerHand.length} cards</p>
        <div className="hand">{computerHand.map((card, idx) => <div key={idx} className={dealAnimation ? "deal-animation" : ""}>{renderCard(card,true)}</div>)}</div>
      </div>

      <div className="center-area">
        <div className="discard-pile">{discardPile.length ? renderCard(discardPile[discardPile.length - 1]) : null}</div>
        {!dealAnimation && playerHand.length === 1 && !playerDeclaredLast && !gameOver &&
          <button onClick={declareUNO} className="last-card-button">Declare UNO</button>}
      </div>

      <PlayerHand hand={playerHand} onCardClick={handlePlayerCard} dealAnimation={dealAnimation} renderCard={renderCard} />

      <button onClick={() => drawCard("player", 1)} disabled={hasDrawn || currentTurn !== "player" || gameOver} className="draw-button">Draw Card</button>

      {unoPopup && <div className="uno-popup">UNO!</div>}

      {selectColor && (
        <div className="color-selector">
          <h3>Choose a Color</h3>
          {colors.map(c => (
            <button key={c} style={{ backgroundColor: c, width:"60px", height:"60px", margin:"5px", borderRadius:"50%" }}
              onClick={() => { pendingWildCard.color = c; setDiscardPile([...discardPile, pendingWildCard]); setPendingWildCard(null); setSelectColor(false); setCurrentTurn("computer"); }} />
          ))}
        </div>
      )}

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
      </div>
    </div>
  );
}

export default GameBoard;
