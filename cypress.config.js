const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:4000',
    // Add the viewport dimensions here
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
