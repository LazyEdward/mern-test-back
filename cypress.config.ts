import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
