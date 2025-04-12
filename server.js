const express = require('express')
const axios = require('axios')
const {
  recordRequest,
  recordResponse,
  recordError,
  recordCacheHit,
  recordCacheMiss,
  getMetrics,
} = require('./src/services/metricsService')
const {
  getCacheKey,
  getCachedData,
  setCachedData,
} = require('./src/services/cacheService')

const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json(getMetrics())
})

// Exchange rates endpoint
app.get(['/exchange-rates', '/exchange-rates/:base'], (req, res) => {
  // User can specify the base currency and currencies they'd like to see exchange rates for
  const baseCurrency = req.params.base || 'NZD'
  const chosenCurrencies = req.query.symbols
    ? req.query.symbols.split(',')
    : null

  // Check cache
  const cacheKey = getCacheKey(baseCurrency, chosenCurrencies)
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    recordCacheHit()
    return res.json(cachedData)
  }
  recordCacheMiss()

  // Helper function to calculate average rates
  const calculateAverageRates = (frankfurterRates, exchangeApiRates) => {
    const average = {}

    const allCurrencies = new Set([
      ...Object.keys(frankfurterRates),
      ...Object.keys(exchangeApiRates),
    ])

    // Filter currencies if requested
    const filteredCurrencies = chosenCurrencies
      ? Array.from(allCurrencies).filter((currency) =>
          chosenCurrencies.includes(currency)
        )
      : allCurrencies

    filteredCurrencies.forEach((currency) => {
      const frankfurterRate = frankfurterRates[currency]
      const exchangeRate = exchangeApiRates[currency]

      if (frankfurterRate && exchangeRate) {
        average[currency] = (frankfurterRate + exchangeRate) / 2
      } else {
        average[currency] = frankfurterRate || exchangeRate
      }
    })

    return average
  }

  recordRequest()

  // API requests
  const frankfurterRequest = axios.get(
    `https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`
  )

  const exchangeApiRequest = axios.get(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`
  )

  Promise.all([frankfurterRequest, exchangeApiRequest])
    .then(([frankfurterResponse, exchangeApiResponse]) => {
      recordResponse()
      const frankfurterRates = frankfurterResponse.data.rates
      const exchangeApiRates =
        exchangeApiResponse.data[baseCurrency.toLowerCase()]

      const averageRates = calculateAverageRates(
        frankfurterRates,
        exchangeApiRates
      )

      const result = {
        datasource: 'Free Currency Rates API',
        base: baseCurrency,
        rates: averageRates,
      }

      // Cache the result
      setCachedData(cacheKey, result)

      res.json(result)
    })
    .catch((error) => {
      recordError()
      res.status(500).json({ error })
    })
})

// Server
app.listen(port, () => {})
