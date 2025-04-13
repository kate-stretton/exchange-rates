const express = require('express')
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
const { fetchExchangeRates } = require('./src/services/exchangeRateService')

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

  // Record request and fetch new data
  recordRequest()
  fetchExchangeRates(baseCurrency, chosenCurrencies)
    .then((result) => {
      // Cache the result
      setCachedData(cacheKey, result)

      // Record successful response
      recordResponse()
      res.json(result)
    })
    .catch((error) => {
      recordError()
      res.status(500).json({ error })
    })
})

// Server
app.listen(port, () => {})
