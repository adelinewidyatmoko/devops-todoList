const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:4000',
    // Add the viewport dimensions here
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
