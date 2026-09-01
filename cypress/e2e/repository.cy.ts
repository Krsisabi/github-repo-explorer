import {
  REPO_DESCRIPTION,
  REPO_LANGUAGES,
  listedRepos,
  repoName,
  repoOwner,
  searchField,
  stubGitHub,
} from '../support/github';

const FIRST = `/${repoOwner(0)}/${repoName(0, 0)}`;

describe('Repository page', () => {
  it('opens from the list and keeps its address on reload', () => {
    stubGitHub();
    cy.visit('/');

    cy.contains('More...').click();

    cy.location('pathname').should('eq', FIRST);
    cy.contains(repoName(0, 0)).should('be.visible');
    cy.contains(REPO_DESCRIPTION).should('be.visible');
    REPO_LANGUAGES.forEach((language) => {
      cy.contains(language).should('be.visible');
    });

    // A deep link into a single-page application is only as good as the
    // server's rewrite, and this is the check that notices when it goes.
    cy.reload();
    cy.location('pathname').should('eq', FIRST);
    cy.contains(REPO_DESCRIPTION).should('be.visible');
  });

  it('tells a repository that does not exist from a service that is down', () => {
    // One message for both used to send anyone with a typo in the address off
    // to refresh the page forever.
    stubGitHub({ repo: 'missing' });
    cy.visit('/octocat/no-such-repository');

    cy.contains('Repository not found').should('be.visible');
    cy.contains('octocat/no-such-repository').should('be.visible');
    cy.contains('GitHub is not answering').should('not.exist');
  });

  it('says the service is down when it is', () => {
    stubGitHub({ repo: 'unavailable' });
    cy.visit(FIRST);

    cy.contains('Could not load the repository').should('be.visible');
    cy.contains('GitHub is not answering').should('be.visible');
    cy.contains('Repository not found').should('not.exist');
  });

  it('offers a way back to the search from a dead address', () => {
    stubGitHub({ repo: 'missing' });
    cy.visit('/octocat/no-such-repository');

    cy.contains('search from the start').click();

    cy.location('pathname').should('eq', '/');
    searchField().should('have.value', '');
    listedRepos().should('have.length', 10);
  });
});
