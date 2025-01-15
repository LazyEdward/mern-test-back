describe('Check Server available', () => {
  it('Check Server available', () => {
    cy.request('/').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('healthy');
    });
  });
});