const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = {}

const getCacheKey = (baseCurrency, chosenCurrencies) => {
  return `${baseCurrency}-${chosenCurrencies?.join(',') || 'all'}`
}

const getCachedData = (cacheKey) => {
  const cachedResult = cache[cacheKey]
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
    return cachedResult.data
  }
  return null
}

const setCachedData = (cacheKey, data) => {
  cache[cacheKey] = {
    data,
    timestamp: Date.now(),
  }
}

module.exports = {
  getCacheKey,
  getCachedData,
  setCachedData,
}
