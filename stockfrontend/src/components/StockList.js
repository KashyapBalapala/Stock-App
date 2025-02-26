import { useState, useEffect } from "react";
import axios from "axios";
import "./StockList.css";

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch top stocks initially
  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/top-stocks/");
        setStocks(res.data);
      } catch (err) {
        setError("Failed to load top stocks");
      } finally {
        setLoading(false);
      }
    };
    fetchTopStocks();
  }, []);

  // Handle search through yfinance API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `http://localhost:8000/api/stock-details/?symbol=${search}`
      );
      setStocks([res.data]); // Wrap in array to match table format
    } catch (err) {
      setError("Stock not found or error fetching data");
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset to top stocks when search is cleared
  const handleClearSearch = async () => {
    setSearch("");
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/top-stocks/");
      setStocks(res.data);
    } catch (err) {
      setError("Failed to load top stocks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by stock symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
          className="stock-search"
        />
        <button type="submit" className="search-button">
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="clear-button"
          >
            Clear
          </button>
        )}
      </form>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <table className="stock-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Day High</th>
            <th>Day Low</th>
            <th>Volume</th>
            <th>P/E Ratio</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td>{stock.name || "N/A"}</td>
              <td>{stock.symbol}</td>
              <td>${stock.currentPrice?.toFixed(2) || "N/A"}</td>
              <td>${stock.dayHigh?.toFixed(2) || "N/A"}</td>
              <td>${stock.dayLow?.toFixed(2) || "N/A"}</td>
              <td>{stock.volume?.toLocaleString() || "N/A"}</td>
              <td>{stock.peRatio?.toFixed(2) || "N/A"}</td>
              <td>
                {stock.marketCap
                  ? `$${(stock.marketCap / 1e9).toFixed(2)}B`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockList;