const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Fetch and average rates from both apis
app.get('/exchange-rates', (req, res) => {
  // Helper function to calculate average rates
  const calculateAverageRates = (frankfurterRates, exchangeApiRates) => {
    const average = {}

    const allCurrencies = new Set([
      ...Object.keys(frankfurterRates),
      ...Object.keys(exchangeApiRates),
    ])

    allCurrencies.forEach((currency) => {
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

  // API requests
  const frankfurterRequest = axios.get(
    'https://api.frankfurter.dev/v1/latest?base=NZD'
  )
  const exchangeApiRequest = axios.get(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/nzd.json'
  )

  Promise.all([frankfurterRequest, exchangeApiRequest])
    .then(([frankfurterResponse, exchangeApiResponse]) => {
      const frankfurterRates = frankfurterResponse.data.rates
      const exchangeApiRates = exchangeApiResponse.data.nzd

      const averageRates = calculateAverageRates(
        frankfurterRates,
        exchangeApiRates
      )

      res.json({
        datasource: 'Free Currency Rates API',
        base: 'NZD',
        rates: averageRates,
      })
    })
    .catch((error) => res.status(500).json({ error }))
})

// Server
app.listen(port, () => {})
