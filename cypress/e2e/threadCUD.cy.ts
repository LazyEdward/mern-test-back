// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

describe('Test thread and post CUD routes', () => {
	const chars = 'abcdefghijklmnopqrstuvwxyz'
	let randomEmail = chars[Math.floor(Math.random() * chars.length)] + '.' + Math.random().toString(36).substring(2, 6) + '@test.com'

	const topic = "vtuber"
	const title = "New Post"

	const topic2 = "anime"
	const title2 = "New Post"

	const content = "Test message"
	let fromThread = ""

	let postId = ""

	before(() => {
		cy.task('dbReset').then(() => {
			cy.task('createDummyUser', { email: randomEmail, password: 'password123' }).then(() => {
				cy.login(randomEmail, 'password123')
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

	it('test thread create', () => {
		cy.request('POST', '/protected/thread/create', {
			topic, title
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('_id');
			expect(response.body).to.have.property('lastModified');
			expect(response.body).to.have.property('topic', 'vtuber');
			expect(response.body).to.have.property('title', "New Post");

			fromThread = response.body._id
		})
	})

	it('test thread and post create', () => {
		cy.request('POST', '/protected/thread/create', {
			topic: topic2, title: title2, post: { content: "Test With post" }
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('_id');
			expect(response.body).to.have.property('lastModified');
			expect(response.body).to.have.property('topic', 'anime');
			expect(response.body).to.have.property('title', "New Post");

			cy.task('getPostsByThreadId', { id: response.body._id }).then((posts: any) => {
				expect(posts).to.have.lengthOf(1);
				expect(posts[0]).to.have.property('content', "Test With post");
			})
		})
	})

	it('test thread update', () => {
		cy.request('POST', '/protected/thread/update', {
			id: fromThread,
			title: "New Post 1"
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('createdDateTime');
			expect(response.body).to.have.property('lastModified');
			expect(response.body.lastModified).to.be.greaterThan(response.body.createdDateTime);
			expect(response.body).to.have.property('title', "New Post 1");
		})
	})

	it('test post create', () => {
		cy.task('getThreadById', { id: fromThread }).then((thread: any) => {
			cy.request('POST', '/protected/post/create', {
				content, fromThread
			}).then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body).to.have.property('_id');
				expect(response.body).to.have.property('fromThread', fromThread);
				expect(response.body).to.have.property('content', "Test message");

				postId = response.body._id

				cy.task('getThreadById', { id: fromThread }).then((newThread: any) => {
					expect(response.body.lastModified).to.be.greaterThan(thread.lastModified);
					expect(newThread.lastModified).to.be.greaterThan(thread.lastModified);
				})
			})
		})
	})

	it('test post update', () => {
		cy.task('getThreadById', { id: fromThread }).then((thread: any) => {
			cy.request('POST', '/protected/post/update', {
				id: postId,
				content: "Test message 2"
			}).then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body).to.have.property('createdDateTime');
				expect(response.body).to.have.property('lastModified');
				expect(response.body.lastModified).to.be.greaterThan(response.body.createdDateTime);
				expect(response.body).to.have.property('content', "Test message 2");

				cy.task('getThreadById', { id: fromThread }).then((newThread: any) => {
					expect(newThread.lastModified).to.be.greaterThan(thread.lastModified);
				})
			})
		})
	})

	it('test post delete', () => {
		cy.request('POST', '/protected/post/delete', {
			id: postId
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('message', "Remove post successfully");
		})
	})

})