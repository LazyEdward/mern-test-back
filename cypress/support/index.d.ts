// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

declare namespace Cypress {
	interface Chainable<Subject> {
		login(email: string, password: string): Chainable<any>;
	}
}