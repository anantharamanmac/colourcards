import React, { useState, useEffect } from "react";
import PlayerHand from "./PlayerHand";
import "./GameBoard.css"; // separate CSS for styling

const colors = ["red", "yellow", "green", "blue"];
const values = ["0","1","2","3","4","5","6","7","8","9","Skip","Reverse","+2"];

function generateDeck() {
  let deck = [];
  colors.forEach(color => {
    values.forEach(value => {
      deck.push({ color, value });
      if (value !== "0") deck.push({ color, value });
    });
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

  // Initialize deck and hands
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
      setTimeout(() => {
        player.push(tempDeck.shift());
        setPlayerHand([...player]);
      }, i * 200);
      setTimeout(() => {
        computer.push(tempDeck.shift());
        setComputerHand([...computer]);
      }, i * 200 + 100);
    }

    setTimeout(() => {
      setDeck(tempDeck);
      setDealAnimation(false);
    }, 7 * 200 + 150);
  };

  const checkGameOver = () => {
    if (playerHand.length === 0) {
      setGameOver(true);
      alert("You Win!");
      return true;
    }
    if (computerHand.length === 0) {
      setGameOver(true);
      alert("Computer Wins!");
      return true;
    }
    if (deck.length === 0) {
      setGameOver(true);
      if (playerHand.length < computerHand.length) {
        alert(`Deck empty! You win with fewer cards (${playerHand.length} vs ${computerHand.length})`);
      } else if (computerHand.length < playerHand.length) {
        alert(`Deck empty! Computer wins with fewer cards (${computerHand.length} vs ${playerHand.length})`);
      } else {
        alert("Deck empty! It's a draw!");
      }
      return true;
    }
    return false;
  };

  const drawCard = (player = "player", count = 1) => {
    if (gameOver) return;
    if (deck.length === 0) {
      checkGameOver();
      return;
    }
    const drawnCards = deck.slice(0, count);
    setDeck(deck.slice(count));

    if (player === "player") {
      if (hasDrawn) return;
      setPlayerHand(prev => [...prev, ...drawnCards]);
      setHasDrawn(true);
      setCurrentTurn("computer");
    } else {
      setComputerHand(prev => [...prev, ...drawnCards]);
    }

    if (deck.length - count <= 0) {
      setTimeout(checkGameOver, 100);
    }
  };

  useEffect(() => {
    if (currentTurn === "player") setHasDrawn(false);
  }, [currentTurn]);

  const applyActionCard = (card, nextPlayer) => {
    if (card.value === "+2") {
      drawCard(nextPlayer, 2);
    } else if (card.value === "Skip") {
      setCurrentTurn(currentTurn); // skip next player
      return;
    } else if (card.value === "Reverse") {
      setCurrentTurn(currentTurn); // acts like skip for 2 players
      return;
    } else {
      setCurrentTurn(nextPlayer);
    }
  };

  const handlePlayerCard = (card) => {
    if (gameOver) return;

    const topCard = discardPile[discardPile.length - 1];
    if (card.color === topCard.color || card.value === topCard.value) {
      const willHaveOneCard = playerHand.length === 2;

      setDiscardPile([...discardPile, card]);
      setPlayerHand(playerHand.filter(c => c !== card));

      if (checkGameOver()) return;

      if (willHaveOneCard && !playerDeclaredLast) {
        setUnoPopup(true);
        setTimeout(() => setUnoPopup(false), 1500);
      }

      setPlayerDeclaredLast(false);
      applyActionCard(card, "computer");
    }
  };

  const declareUNO = () => {
    setPlayerDeclaredLast(true);
    setUnoPopup(false);
    alert("You declared UNO!");
  };

  useEffect(() => {
    if (currentTurn === "computer" && !dealAnimation && !gameOver) {
      setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1];
        const playable = computerHand.find(c => c.color === topCard.color || c.value === topCard.value);

        if (computerHand.length === 2 && !computerDeclaredLast) {
          if (Math.random() < 0.5) {
            drawCard("computer", 1);
          }
          setComputerDeclaredLast(true);
        } else if (computerHand.length === 1) {
          setComputerDeclaredLast(true);
        }

        if (playable) {
          setDiscardPile([...discardPile, playable]);
          setComputerHand(computerHand.filter(c => c !== playable));
          if (!checkGameOver()) applyActionCard(playable, "player");
        } else {
          drawCard("computer", 1);
          if (!checkGameOver()) setCurrentTurn("player");
        }
      }, 1000);
    }
  }, [currentTurn, discardPile, computerHand, deck, dealAnimation, computerDeclaredLast, gameOver]);

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
        <div className="hand">
          {computerHand.map((card, idx) => (
            <div key={idx} className={dealAnimation ? "deal-animation" : ""}>
              {renderCard(card, true)}
            </div>
          ))}
        </div>
      </div>

      <div className="center-area">
        <div className="discard-pile">
          {discardPile.length ? renderCard(discardPile[discardPile.length - 1]) : null}
        </div>
        {!dealAnimation && playerHand.length === 1 && !playerDeclaredLast && !gameOver && (
          <button onClick={declareUNO} className="last-card-button">
            Declare UNO
          </button>
        )}
      </div>

      <PlayerHand
        hand={playerHand}
        onCardClick={handlePlayerCard}
        dealAnimation={dealAnimation}
        renderCard={renderCard}
      />

      <button
        onClick={() => drawCard("player", 1)}
        disabled={hasDrawn || currentTurn !== "player" || gameOver}
        className="draw-button"
      >
        Draw Card
      </button>

      {unoPopup && <div className="uno-popup">UNO!</div>}
    </div>
  );
}

export default GameBoard;
