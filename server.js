const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Simple fetch for frankfurter api using NZD as base currency
app.get('/exchange-rates', (req, res) => {
  axios
    .get('https://api.frankfurter.dev/v1/latest?base=NZD')
    .then((response) => res.json(response.data))
    .catch((error) => res.status(500).json({ error }))
})

// Additional fetch for exchange-api using NZD as base currency
app.get('/exchange-rates/2', (req, res) => {
  axios
    .get(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/nzd.json'
    )
    .then((response) => res.json(response.data))
    .catch((error) => res.status(500).json({ error }))
})

// Server
app.listen(port, () => {})
