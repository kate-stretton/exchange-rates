# Exchange rates

## Overview
This is a simple application written in JavaScript that fetches exchange rates from two different API's, and returns the average of the results. Users can specify a base currency and the currencies they wish to see the exchanges rates for. If no base currency is specified, it defaults to NZD. To reduce external API requests and improve response times, results for specific API calls are cached and stored for 5 minutes.  

## Tech stack
- Node.js
- Express
- Axios (external API calls)
- Jest (unit testing)

## Installation and running the app 
```
npm install
npm start
The app runs on: http://localhost:3000
```

## API usage
  **GET**  /exchange-rates/{baseCur}?symbols={SYM1,SYM2...}
  
  This endpoint returns the latest exchange rates relative to the base currency.

  **Example** GET  /exchange-rates/nzd?symbols=USD,AUD
  
  **Response**
  ```json
  {
    "datasource": "Free Currency Rates API",
    "base": "EUR",
    "rates": {
      "USD": 1.078588,
      "NZD": 1.599893
    }
  }
  ```

  **GET**  /metrics

  This endpoint returns metrics for the exchange rate APIs request and responses counts, errors and cached results. 

  **Response**
  ```
  {
    "totalQueries": 0,
    "apis": [
      {
        "name": "freeCurrencyRates",
        "metrics": {
          "totalRequests": 0,
          "totalResponses": 0,
          "totalErrors": 0,
          "totalCacheHits": 0,
          "totalCacheMisses": 0
        }
      }
    ],
    "timestamp": "2025-04-13T01:46:51.635Z"
  }
  ```
  
  
  

  

## Running tests
```
npm test
```

## Approach

## Improvements



