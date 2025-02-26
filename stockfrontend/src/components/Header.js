import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();

  return (
    <nav className="header">
      <div className="logo">
        <Link to="/">📊 Stock Predictor</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          About
        </Link>
        <Link
          to="/stocks"
          className={location.pathname === "/stocks" ? "active" : ""}
        >
          Stocks
        </Link>
        <Link
          to="/search"
          className={location.pathname === "/search" ? "active" : ""}
        >
          Prediction
        </Link>
      </div>
    </nav>
  );
}

export default Header;
