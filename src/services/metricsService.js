const metrics = {
  totalQueries: 0,
  apis: [
    {
      name: 'freeCurrencyRates',
      metrics: {
        totalRequests: 0,
        totalResponses: 0,
        totalErrors: 0,
        totalCacheHits: 0,
        totalCacheMisses: 0,
      },
    },
  ],
}

const recordRequest = () => {
  metrics.totalQueries++
  metrics.apis[0].metrics.totalRequests++
}

const recordResponse = () => {
  metrics.apis[0].metrics.totalResponses++
}

const recordError = () => {
  metrics.apis[0].metrics.totalErrors++
}

const recordCacheHit = () => {
  metrics.apis[0].metrics.totalCacheHits++
}

const recordCacheMiss = () => {
  metrics.apis[0].metrics.totalCacheMisses++
}

const getMetrics = () => {
  return {
    ...metrics,
    timestamp: new Date().toISOString(),
  }
}

module.exports = {
  recordRequest,
  recordResponse,
  recordError,
  recordCacheHit,
  recordCacheMiss,
  getMetrics,
}
