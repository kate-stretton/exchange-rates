const axios = require('axios')
const {
  calculateAverageRates,
  fetchExchangeRates,
} = require('../services/exchangeRateService')

// Mock axios
jest.mock('axios')

describe('API integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch and return rates for requested currencies', async () => {
    // Mock API responses
    const mockFrankfurterResponse = {
      data: {
        rates: {
          USD: 1.0,
          NZD: 1.62,
          AUD: 1.48,
        },
      },
    }
    const mockExchangeApiResponse = {
      data: {
        usd: {
          USD: 1.0,
          NZD: 1.6,
          AUD: 1.5,
        },
      },
    }

    // Mock axios get method
    axios.get.mockImplementation((url) => {
      if (url.includes('frankfurter')) {
        return Promise.resolve(mockFrankfurterResponse)
      }
      return Promise.resolve(mockExchangeApiResponse)
    })

    const result = await fetchExchangeRates('USD', ['NZD', 'AUD'])

    // Verify the result and API calls
    expect(result).toEqual({
      base: 'USD',
      datasource: 'Free Currency Rates API',
      rates: {
        NZD: 1.61,
        AUD: 1.49,
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.frankfurter.dev/v1/latest?base=USD'
    )
    expect(axios.get).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
    )
  })
})

describe('Average exchange rate calculation', () => {
  it('should calculate the average rates from both APIs', () => {
    const frankfurterRates = {
      NZD: 1.0, // base currency
      AUD: 0.92,
    }

    const exchangeApiRates = {
      NZD: 1.0, // base currency
      AUD: 0.94,
    }

    const result = calculateAverageRates(frankfurterRates, exchangeApiRates)

    expect(result.NZD).toBe(1.0)
    expect(result.AUD).toBeCloseTo(0.93, 2)
  })
})
