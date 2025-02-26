from django.shortcuts import render
# stocks/views.py
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from sklearn.preprocessing import MinMaxScaler
from django.shortcuts import render
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input

# Predefined list of top stock tickers
TOP_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK-B', 'NVDA', 'JPM', 'V']

@api_view(['GET'])
def top_stocks(request):
    stocks_data = []
    
    for ticker in TOP_STOCKS:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period='1d')
        
        if not hist.empty:
            stocks_data.append({
                'symbol': ticker,
                'name': info.get('shortName', ''),
                'currentPrice': info.get('currentPrice', 'N/A'),
                'dayHigh': hist['High'].iloc[0],
                'dayLow': hist['Low'].iloc[0],
                'volume': hist['Volume'].iloc[0],
                'peRatio': info.get('trailingPE', 'N/A'),
                'marketCap': info.get('marketCap', 'N/A'),
            })
    
    return Response(stocks_data)

@api_view(['GET'])
def stock_details(request):
    symbol = request.GET.get('symbol', '').upper()
    
    if not symbol:
        return Response({'error': 'Symbol parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        hist = stock.history(period='1d')
        
        if hist.empty:
            return Response({'error': 'No data found'}, status=status.HTTP_404_NOT_FOUND)
        
        details = {
            'symbol': symbol,
            'name': info.get('shortName', ''),
            'currentPrice': info.get('currentPrice', 'N/A'),
            'dayHigh': hist['High'].iloc[0],
            'dayLow': hist['Low'].iloc[0],
            'volume': hist['Volume'].iloc[0],
            'peRatio': info.get('trailingPE', 'N/A'),
            'marketCap': info.get('marketCap', 'N/A'),
        }
        
        return Response(details)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def predict_stock(request):
    symbol = request.GET.get('symbol', '').upper()
    
    if not symbol:
        return Response({'error': 'Symbol parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get historical data
        stock = yf.Ticker(symbol)
        hist = stock.history(period='1y')
        
        if hist.empty:
            return Response({'error': 'No historical data found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Prepare data for prediction (simple linear regression example)
        df = hist[['Close']].reset_index()
        df['Days'] = (df['Date'] - df['Date'].min()).dt.days
        
        X = df['Days'].values.reshape(-1, 1)
        y = df['Close'].values
        
        # Train linear regression model
        from sklearn.linear_model import LinearRegression
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next 15 days
        last_date = df['Date'].max()
        future_dates = [last_date + timedelta(days=i) for i in range(1, 16)]
        future_days = [(date - df['Date'].min()).days for date in future_dates]
        
        predictions = model.predict(np.array(future_days).reshape(-1, 1))
        
        # Format response
        prediction_data = [
            {
                'date': date.strftime('%Y-%m-%d'),
                'predictedPrice': round(float(price), 2)
            }
            for date, price in zip(future_dates, predictions)
        ]
        
        return Response({
            'symbol': symbol,
            'predictions': prediction_data
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.shortcuts import render
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input

@api_view(['GET'])
def predict_stock_LSTM(request):
    symbol = request.GET.get('symbol', '').upper()
    
    if not symbol:
        return Response({'error': 'Symbol parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get historical data
        stock = yf.Ticker(symbol)
        hist = stock.history(period='1y')

        if hist.empty:
            return Response({'error': 'No historical data found'}, status=status.HTTP_404_NOT_FOUND)

        # Preprocess data
        df = hist[['Close']].copy()
        df = df.asfreq('D')  # Ensure daily frequency
        df.fillna(method='ffill', inplace=True)  # Forward fill missing values

        # Normalize data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(df.values)

        # Function to create dataset for LSTM
        def create_dataset(dataset, time_steps=60, future_days=15):
            X, y = [], []
            for i in range(len(dataset) - time_steps - future_days):
                X.append(dataset[i:i + time_steps, 0])
                y.append(dataset[i + time_steps:i + time_steps + future_days, 0])  # Predict next 15 days
            return np.array(X), np.array(y)

        time_steps = 60
        X, y = create_dataset(scaled_data, time_steps, 15)

        # Ensure correct input shape for LSTM
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))

        # Build LSTM model
        model = Sequential([
            Input(shape=(time_steps, 1)),
            LSTM(units=50, return_sequences=True),
            Dropout(0.2),
            LSTM(units=50, return_sequences=False),
            Dropout(0.2),
            Dense(15)  # Predict 15 future days
        ])

        model.compile(optimizer='adam', loss='mean_squared_error')

        # Train model (use only past data to prevent lookahead bias)
        model.fit(X[:-15], y[:-15], epochs=20, batch_size=32, verbose=0)

        # Prepare input for future prediction
        last_sequence = scaled_data[-time_steps:]
        last_sequence = last_sequence.reshape(1, time_steps, 1)

        # Predict next 15 days
        predicted_scaled = model.predict(last_sequence)
        predicted_prices = scaler.inverse_transform(predicted_scaled)[0]

        # Generate future dates
        last_date = df.index[-1]
        future_dates = [last_date + timedelta(days=i) for i in range(1, 16)]
        
        # Prepare past 60 days predictions
        past_actual_prices = df['Close'][-60:].tolist()
        past_prediction_dates = df.index[-60:].tolist()
        past_predicted_prices = []

        for i in range(-60, 0):  # Predict for each past 60 days window
            past_input = scaled_data[i - time_steps:i].reshape(1, time_steps, 1)
            past_predicted_scaled = model.predict(past_input)
            past_predicted_prices.append(scaler.inverse_transform(past_predicted_scaled)[0][0])  # Take first prediction

        # Format response
        past_predictions_data = [{
            'date': date.strftime('%Y-%m-%d'),
            'actualPrice': round(float(actual), 2),
            'predictedPrice': round(float(predicted), 2)
        } for date, actual, predicted in zip(past_prediction_dates, past_actual_prices, past_predicted_prices)]

        future_predictions_data = [{
            'date': date.strftime('%Y-%m-%d'),
            'predictedPrice': round(float(price), 2)
        } for date, price in zip(future_dates, predicted_prices)]
        
        return Response({
            'symbol': symbol,
            'model': 'LSTM',
            'past_predictions': past_predictions_data,
            'future_predictions': future_predictions_data
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
