// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

describe('Test user routes', () => {

	const chars = 'abcdefghijklmnopqrstuvwxyz'
	let randomEmail = chars[Math.floor(Math.random() * chars.length)] + '.' + Math.random().toString(36).substring(2, 6) + '@test.com'

	before(() => {
		cy.task('dbReset')
		cy.task('createDummyUser', { email: randomEmail, password: 'password123' })
		cy.login(randomEmail, 'password123')
	})

	after(() => {
		cy.clearCookie('accessToken')
		cy.clearCookie('refreshToken')
		cy.task('dbReset')
	})

	it('test get user Info', () => {
		cy.request('/protected/user').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('email');
			cy.getCookie('accessToken').should('not.be.null');
			cy.getCookie('refreshToken').should('not.be.null');
		});
	})

	it('test get active session counts', () => {
		cy.request('/protected/session/count').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('activeSessions');
			cy.getCookie('accessToken').should('not.be.null');
			cy.getCookie('refreshToken').should('not.be.null');
		});
	})

	it('test remove other sessions', () => {
		cy.request('POST', '/protected/session/logout/others').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('message', "Logged out other sessions successfully");
			cy.getCookie('accessToken').should('not.be.null');
			cy.getCookie('refreshToken').should('not.be.null');
		});
	})
})