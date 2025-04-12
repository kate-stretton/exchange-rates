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

// Server
app.listen(port, () => {})
