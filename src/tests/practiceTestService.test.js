const result = require('../services/practiceTestService')

test('should return 100', () => {
  expect(result()).toBe(100)
})
