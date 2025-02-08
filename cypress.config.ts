import { defineConfig } from "cypress";
import mongoose from "mongoose";

import { MONGO_URI } from "./src/constants/env";
import { createAccount } from './src/services/auth'
import { createPost, createThread, getPostsByThreadId, getThread } from './src/services/thread'
import { THREAD_TOPICS } from "./src/models/thread";
import { DEFAULT_PAGE_SIZE, OLD_TO_NEW } from "./src/utils/pagination";

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
            const account = await createAccount({ email, password })
            await mongoose.disconnect()
            return account
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
        },
        async getPostsByThreadId({ id }) {
          try {
            await mongoose.connect(MONGO_URI);
            const posts = await getPostsByThreadId(id, {
              page: 0,
              pageSize: DEFAULT_PAGE_SIZE,
              sortBy: [OLD_TO_NEW]
            })
            await mongoose.disconnect()
            return posts
          } catch (error) {
            throw new Error(`Failed to find Thread: ${error}`)
          }
        },
        async createDummyThreadData({ host }) {
          try {
            await mongoose.connect(MONGO_URI);

            const dummyThreads = [
              {
                topic: THREAD_TOPICS[4], //"vtuber"
                subTopic: undefined,
                title: "Lorem Ipsum",
                isPublicViewable: true
              },
              {
                topic: THREAD_TOPICS[4],
                subTopic: undefined,
                title: "New Vtuber",
                isPublicViewable: true
              },
              {
                topic: THREAD_TOPICS[0], //"anime"
                subTopic: undefined,
                title: "New Anime",
                isPublicViewable: true
              },
              {
                topic: THREAD_TOPICS[0],
                subTopic: "News",
                title: "Lorem Ipsum",
                isPublicViewable: true
              },
              {
                topic: THREAD_TOPICS[3], //"game"
                subTopic: "News",
                title: "Game Release LEAK",
                isPublicViewable: false
              },
            ]

            const dummyPosts = [
              [
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: false
                },
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: false
                },
              ],
              [
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: false
                },
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: false
                },
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: false
                },
              ],
              [],
              [
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: false
                },
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: true
                },
              ],
              [
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: true
                },
                {
                  tag1: undefined,
                  tag2: undefined,
                  replyTo: undefined,
                  isHidden: false
                },
              ],
            ]

            for (let i = 0; i < dummyThreads.length; i++) {
              const newThread = await createThread({ ...dummyThreads[i], host })
              for (let j = 0; j < dummyPosts[i].length; j++)
                await createPost({ ...dummyPosts[i][j], content: `New Post ${j}`, fromThread: newThread._id as string, createdUser: host })
            }

            await mongoose.disconnect()
            return null
          } catch (error) {
            throw new Error(`Failed to create Threads and Posts: ${error}`)
          }
        },
        async createDummyThread({ topic, subTopic = undefined, title, isPublicViewable = false, host }) {
          try {
            await mongoose.connect(MONGO_URI);
            const thread = await createThread({ topic, subTopic, title, isPublicViewable, host })
            await mongoose.disconnect()
            return thread
          } catch (error) {
            throw new Error(`Failed to create Thread: ${error}`)
          }
        },
        async createDummyPost({ fromThread, createdUser, content, tag1 = undefined, tag2 = undefined, replyTo = undefined, isHidden = false }) {
          try {
            await mongoose.connect(MONGO_URI);
            const post = await createPost({ fromThread, createdUser, content, tag1, tag2, replyTo, isHidden })
            await mongoose.disconnect()
            return post
          } catch (error) {
            throw new Error(`Failed to create Post: ${error}`)
          }
        }
      })
    },
  },
});
