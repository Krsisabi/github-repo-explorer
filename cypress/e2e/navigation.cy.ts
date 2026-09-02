import { listedRepos, stubGitHub } from '../support/github';

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
});
