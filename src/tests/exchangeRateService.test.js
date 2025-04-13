const { calculateAverageRates } = require('../services/exchangeRateService')

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
