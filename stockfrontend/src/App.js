import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import About from "./components/About";
import StockList from "./components/StockList";
import StockSearch from "./components/StockSearch";
import Prediction from "./components/StockPrediction";
import "./App.css";

function Layout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <div className="content">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/stocks"
          element={
            <Layout>
              <StockList />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <StockSearch />
            </Layout>
          }
        />
        <Route
          path="/prediction/:symbol"
          element={
            <Layout>
              <Prediction />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
