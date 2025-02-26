import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StockSearch.css";

function StockSearch() {
  const [symbol, setSymbol] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (symbol.trim()) {
      navigate(`/prediction/${symbol.toUpperCase()}`);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter Stock Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSubmit} className="search-button">
        Predict
      </button>
    </div>
  );
}

export default StockSearch;
