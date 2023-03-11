const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://www.kiwi.com",
    viewportWidth: 1280,
    viewportHeight: 800,
    experimentalRunAllSpecs: true,
    requestTimeout: 10_000,
    env: {
      hideXhr: true,
    },
  },
})
