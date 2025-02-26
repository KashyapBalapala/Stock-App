import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./StockPrediction.css"; // Optional for styling

Chart.register(...registerables);

function Prediction() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/predict/LSTM?symbol=${symbol}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [symbol]);

  if (!data) return <div className="message loading">Loading...</div>;
    if (data.error) return <div className="message error">Stock Not Available, Please Enter Valid Stock Symbol</div>;


  // Extracting data for the graph
  const dates = data.past_predictions.map((p) => p.date);
  const actualPrices = data.past_predictions.map((p) => p.actualPrice);
  const predictedPrices = data.past_predictions.map((p) => p.predictedPrice);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Actual Price",
        data: actualPrices,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Predicted Price",
        data: predictedPrices,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10, // Limit the number of labels for better readability
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  function openYfinance() {
    window.open(`https://finance.yahoo.com/quote/${symbol}`, "_blank");
  }  

  return (
    <div className="prediction-container">
      <h2>Predictions for {symbol}</h2>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <div><button onClick={openYfinance}>Click Here to Get More Data on {symbol}</button></div>

      {/* <h3>Past 60 Days</h3>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Actual Price</th>
            <th>Predicted Price</th>
          </tr>
        </thead>
        <tbody>
          {data.past_predictions.map((p, i) => (
            <tr key={i}>
              <td>{p.date}</td>
              <td>${p.actualPrice}</td>
              <td>${p.predictedPrice}</td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <h3>Next 15 Days</h3>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Predicted Price</th>
          </tr>
        </thead>
        <tbody>
          {data.future_predictions.map((p, i) => (
            <tr key={i}>
              <td>{p.date}</td>
              <td>${p.predictedPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Prediction;
