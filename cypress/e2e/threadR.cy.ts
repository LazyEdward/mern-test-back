// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

describe('Test thread and post Query routes', () => {
	const chars = 'abcdefghijklmnopqrstuvwxyz'
	let randomEmail = chars[Math.floor(Math.random() * chars.length)] + '.' + Math.random().toString(36).substring(2, 6) + '@test.com'

	let testThreadId = ""
	let testPostId = ""

	before(() => {
		cy.task('dbReset').then(() => {
			cy.task('createDummyUser', { email: randomEmail, password: 'password123' }).then((account: any) => {
				cy.login(randomEmail, 'password123').then(() => {
					cy.task('createDummyThreadData', { host: account.user._id })
				})
			})
		})
	})

	after(() => {
		cy.clearCookie('accessToken').then(() => {
			cy.clearCookie('refreshToken').then(() => {
				cy.task('dbReset')
			})
		})
	})

	it('test dashboard', () => {
		cy.request('/public').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('lastUpdated')
			expect(response.body).to.have.property('topics')

			expect(response.body.topics).to.have.property('anime')
			expect(response.body.topics).to.have.property('manga')
			expect(response.body.topics).to.have.property('novel')
			expect(response.body.topics).to.have.property('game')
			expect(response.body.topics).to.have.property('vtuber')

			expect(response.body.topics.anime).to.have.lengthOf(2)
			expect(response.body.topics.manga).to.have.lengthOf(0)
			expect(response.body.topics.novel).to.have.lengthOf(0)
			expect(response.body.topics.game).to.have.lengthOf(1)
			expect(response.body.topics.vtuber).to.have.lengthOf(2)

		})
	})

	it('test threads by topic', () => {
		cy.request('/public/threads/vtuber').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('lastUpdated')
			expect(response.body).to.have.property('threads')
			expect(response.body.threads).to.have.lengthOf(2)

			testThreadId = response.body.threads[0]._id
		})
		cy.request('/public/threads/novel').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('lastUpdated')
			expect(response.body).to.have.property('threads')
			expect(response.body.threads).to.have.lengthOf(0)
		})
	})

	it('test threads by topic and subTopic', () => {
		cy.request('/public/threads/anime').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('lastUpdated')
			expect(response.body).to.have.property('threads')
			expect(response.body.threads).to.have.lengthOf(2)
		})
		cy.request('/public/threads/anime?subTopic=News').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('lastUpdated')
			expect(response.body).to.have.property('threads')
			expect(response.body.threads).to.have.lengthOf(1)
		})
	})

	it('test posts by thread id', () => {
		cy.request(`/public/posts/${testThreadId}`).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('lastUpdated')
			expect(response.body).to.have.property('thread')
			expect(response.body).to.have.property('posts')
			expect(response.body.posts).to.have.lengthOf(3)
		})
		cy.request(`/public/posts/${testThreadId}?includeThread=true`).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('lastUpdated')
			expect(response.body).to.have.property('thread')
			expect(response.body).to.have.property('posts')
			expect(response.body.posts).to.have.lengthOf(3)
		})
	})

})