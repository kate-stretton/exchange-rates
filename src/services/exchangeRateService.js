const axios = require('axios')

const calculateAverageRates = (
  frankfurterRates,
  exchangeApiRates,
  chosenCurrencies
) => {
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

const fetchExchangeRates = (baseCurrency, chosenCurrencies) => {
  const frankfurterRequest = axios.get(
    `https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`
  )

  const exchangeApiRequest = axios.get(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`
  )

  return Promise.all([frankfurterRequest, exchangeApiRequest]).then(
    ([frankfurterResponse, exchangeApiResponse]) => {
      const frankfurterRates = frankfurterResponse.data.rates
      const exchangeApiRates =
        exchangeApiResponse.data[baseCurrency.toLowerCase()]

      const averageRates = calculateAverageRates(
        frankfurterRates,
        exchangeApiRates,
        chosenCurrencies
      )

      return {
        datasource: 'Free Currency Rates API',
        base: baseCurrency,
        rates: averageRates,
      }
    }
  )
}

module.exports = {
  fetchExchangeRates,
}
