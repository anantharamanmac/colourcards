// GameLoader.js
import React, { useEffect, useState } from "react";
import "./GameLoader.css";

function GameLoader({ onStart }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onStart();
    }, 3500); // 3.5s loading
    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <div className="loader-screen">
      {loading && (
        <div className="loader">
          <div className="card-stack">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="shuffle-card" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <h2>Shuffling Cards...</h2>
        </div>
      )}
    </div>
  );
}

export default GameLoader;
