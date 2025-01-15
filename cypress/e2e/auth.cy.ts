// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import cypress = require("cypress");

describe('Test auth routes', () => {

	const chars = 'abcdefghijklmnopqrstuvwxyz'
	let randomEmail = chars[Math.floor(Math.random() * chars.length)] + '.' + Math.random().toString(36).substring(2, 6) + '@test.com'

	it('test register route', () => {
		cy.request('POST', '/auth/register', {
			email: randomEmail,
			password: 'password123',
			confirmPassword: 'password123',
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('email');
			cy.getCookie('accessToken').should('not.be.null');
			cy.getCookie('refreshToken').should('not.be.null');
		});
	})

	it('test login route', () => {
		cy.login(randomEmail, 'password123').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('email');
			cy.getCookie('accessToken').should('not.be.null');
			cy.getCookie('refreshToken').should('not.be.null');
		});
	})

	it('test refresh route', () => {
		let refreshToken = cy.getCookie('refreshToken') ?? '';
		console.log(refreshToken);

		cy.request('POST', '/auth/refresh').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('message', 'Session refreshed');
			cy.getCookie('accessToken').should('not.be.null');
			cy.getCookie('refreshToken').should('not.equal', refreshToken);
		});
	})

	it('test reset password rotue', () => {
		cy.request('POST', '/auth/password/reset', {
			email: randomEmail,
			password: 'password456',
			confirmPassword: 'password456',
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('message', "Password successfully reset. Please login with new password");
		});
	})

	it('test logout route', () => {
		cy.request('POST', '/auth/logout').then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('message', 'Logged out successfully');
			cy.getCookie('accessToken').should('be.null');
			cy.getCookie('refreshToken').should('be.null');
		});
	})

})