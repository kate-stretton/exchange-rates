# Exchange rates

## Overview
This is a simple application written in JavaScript that fetches exchange rates from two different external API's, and returns the average of the results. Users can specify a base currency and the currencies they wish to see the exchanges rates for. If no base currency is specified, it defaults to NZD. To reduce external API requests and improve response times, results for specific API calls are cached and stored for 5 minutes.  

## Tech stack
- Node.js
- Express
- Axios (external API calls)
- Jest (unit testing)

## Installation and running the app 
```
npm install
npm start
```
The app runs on: http://localhost:3000

## API usage
  **GET**  /exchange-rates/{baseCur}?symbols={SYM1,SYM2...}
  
  This endpoint returns the latest exchange rates relative to the base currency.

  **Example** 
  
  **GET**  /exchange-rates/nzd?symbols=USD,AUD
  
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

  This endpoint returns metrics for the exchange are API and counts requests, responses, errors and cached results. 

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
My approach to this task was to set up a basic Express server using Node.js, install Axios, and start with an initial GET endpoint for each https://frankfurter.dev/ and https://github.com/fawazahmed0/exchange-api. I opted for this tech stack because I'd worked with it before, albeit not recently.

Once I had this working, I refactored to use a single GET endpoint (`/exchange-rates`) that queried both APIs, and calculated and returned an average result. I then added the functionality to specify the base currency, and also filter for specific exchange rates.

From there, I introduced caching and then the metrics endpoint. I spent some time manually testing the caching logic by adding temporary console.logs. I did a little research and considered using Prometheus as a metrics library, but ultimately decided the simplest approach was to write the code for this myself. Once this was working, I did some refactoring to move the exchange rate fetch, caching and metrics logic into decicated files. 

Given the timeframe, and that I haven't written unit tests recently, I chose to focus on getting the core functionality working first and left the unit testing until last. I've previously used the testing framework Jest, so spent some time reading about this before installing it and writing a practice test and a test to check the average rate calcuation. At that point I was approaching the end of the allocated timeframe. I spent some additional time researching how to mock the API call with Axios, but the testing component of this task is fundamentally incomplete. I recognise that it's better to write the unit tests alongside development, and would try to prioritise this if I were to approach the task again.

## Improvements
Aside from my approach to testing, and as a direct result of having left testing until last, I think the error handling could be improved. This would make it easier to identify issues and fix them, and would also improve the user experience. 

I would also have liked to spend more time on the logic around failed API calls, and am not sure I correctly understood what the requirements were regarding the metrics endpoint. 

Finally, when I was refactoring, I forgot to separate the routes into a different file. 


