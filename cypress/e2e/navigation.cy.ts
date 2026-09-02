import { listedRepos, searchField, stubGitHub } from '../support/github';

describe('Navigation', () => {
  it('names the address it could not match and offers a way out', () => {
    stubGitHub();
    cy.visit('/one/two/three', { failOnStatusCode: false });

    cy.contains('Page not found').should('be.visible');
    cy.contains('/one/two/three').should('be.visible');

    cy.contains('Back to the search').click();

    cy.location('pathname').should('eq', '/');
    listedRepos().should('have.length', 10);
  });

  it('gives the icon link in the header a name assistive technology can read', () => {
    stubGitHub();
    cy.visit('/');

    cy.get('header a[href*="github.com"]')
      .should('have.attr', 'aria-label')
      .and('not.be.empty');
  });

  it('names the search field for anyone who cannot see the magnifier', () => {
    stubGitHub();
    cy.visit('/');

    // The label is on screen but clipped, so `be.visible` would fail on it:
    // what matters is that it exists and points at the field.
    searchField()
      .invoke('attr', 'id')
      .then((id) => {
        cy.get(`label[for="${id}"]`).should('contain.text', 'Search GitHub');
      });
  });
});
