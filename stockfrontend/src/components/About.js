import "./About.css";

function About() {
  return (
    <div className="about-container">
      <h1 className="about-header">Welcome to Stock Predictor</h1>
      
      <div className="about-section">
        <h2>About Our Platform</h2>
        <p>
          Stock Predictor is an advanced financial analytics tool that combines machine learning 
          with real-time market data to provide intelligent stock price forecasts. Our platform 
          empowers investors with predictive insights and comprehensive stock analysis.
        </p>
      </div>

      <div className="about-section">
        <h2>Key Features</h2>
        <ul className="feature-list">
          <li>📈 15-day price predictions using ARIMA and LSTM models</li>
          <li>📊 Real-time stock data from Yahoo Finance</li>
          <li>🔍 Top stock listings with detailed metrics</li>
          <li>📉 Historical vs predicted performance comparisons</li>
          <li>🔔 Customizable watchlists and alerts (coming soon)</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>How It Works</h2>
        <div className="workflow">
          <div className="workflow-step">
            <h3>1. Search & Analyze</h3>
            <p>Enter any stock symbol to view current market data and historical trends</p>
          </div>
          <div className="workflow-step">
            <h3>2. Predictive Modeling</h3>
            <p>Our AI models analyze patterns and market indicators to forecast prices</p>
          </div>
          {/* <div className="workflow-step">
            <h3>3. Informed Decisions</h3>
            <p>Get comprehensive reports combining technical analysis and market sentiment</p>
          </div> */}
        </div>
      </div>

      <div className="about-section">
        <h2>Our Technology</h2>
        <p>
          Powered by cutting-edge technologies:
          <br />
          <span className="tech-stack">
            React · Django · Python · TensorFlow · Yahoo Finance API 
          </span>
        </p>
      </div>

      <div className="disclaimer">
        <h3>Important Notice</h3>
        <p>
          🚨 Stock predictions are based on machine learning models and historical data, 
          not financial advice. Always consult with a qualified financial advisor 
          before making investment decisions. Past performance is not indicative 
          of future results.
        </p>
      </div>

      <div className="contact-section">
        <p>Have questions? <a href="/contact">Contact our support team</a></p>
        <p>Follow us on [Social Media Links]</p>
      </div>
    </div>
  );
}

export default About;