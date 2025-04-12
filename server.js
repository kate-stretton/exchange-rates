const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Fetch and average rates from both apis
app.get(['/exchange-rates', '/exchange-rates/:base'], (req, res) => {
  // User can specify the base currency, otherwise it defaults to NZD
  const baseCurrency = req.params.base || 'NZD'
  // User can sepcify the currencies they'd like to see exchange rates for
  const chosenCurrencies = req.query.symbols
    ? req.query.symbols.split(',')
    : null

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

  // API requests
  const frankfurterRequest = axios.get(
    `https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`
  )
  const exchangeApiRequest = axios.get(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`
  )

  Promise.all([frankfurterRequest, exchangeApiRequest])
    .then(([frankfurterResponse, exchangeApiResponse]) => {
      const frankfurterRates = frankfurterResponse.data.rates
      const exchangeApiRates =
        exchangeApiResponse.data[baseCurrency.toLowerCase()]

      const averageRates = calculateAverageRates(
        frankfurterRates,
        exchangeApiRates
      )

      res.json({
        datasource: 'Free Currency Rates API',
        base: baseCurrency,
        rates: averageRates,
      })
    })
    .catch((error) => res.status(500).json({ error }))
})

// Server
app.listen(port, () => {})
