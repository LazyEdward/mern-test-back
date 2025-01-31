import { defineConfig } from "cypress";
import mongoose from "mongoose";

import { MONGO_URI } from "./src/constants/env";
import { createAccount } from './src/services/auth'
import { getThread } from './src/services/thread'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async dbReset() {
          try {
            await mongoose.connect(MONGO_URI);
            await mongoose.connection.db?.dropDatabase();
            await mongoose.disconnect()
            return null
          } catch (error) {
            throw new Error(`Unable to reset the database: ${error}`)
          }
        },
        async createDummyUser({ email, password }) {
          try {
            await mongoose.connect(MONGO_URI);
            await createAccount({ email, password })
            await mongoose.disconnect()
            return null
          } catch (error) {
            throw new Error(`Failed to create dummy user: ${error}`)
          }
        },
        async getThreadById({ id }) {
          try {
            await mongoose.connect(MONGO_URI);
            const thread = await getThread(id)
            await mongoose.disconnect()
            return thread
          } catch (error) {
            throw new Error(`Failed to find Thread: ${error}`)
          }
        }
      })
    },
  },
});
