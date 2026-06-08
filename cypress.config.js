const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    // Add the viewport dimensions here
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
