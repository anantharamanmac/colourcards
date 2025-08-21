import React, { useEffect, useState } from "react";
import "./GameLoader.css";

function GameLoader({ onStart }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onStart();
    }, 3500); // 3.5s
    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <div className="loader-screen">
      {loading && (
        <div className="loader">
          <div className="shuffle-area">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`shuffle-card card-${i}`} />
            ))}
          </div>
          <h2 className="loader-text">Shuffling the Deck...</h2>
        </div>
      )}
    </div>
  );
}

export default GameLoader;
