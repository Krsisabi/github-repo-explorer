import {
  githubCalls,
  listedRepos,
  repoName,
  searchField,
  stubGitHub,
} from '../support/github';

describe('Search', () => {
  it('puts the query in the address so a reload lands on the same results', () => {
    stubGitHub();
    cy.visit('/');
    listedRepos().should('have.length', 10);

    searchField().type('tetris');
    cy.location('search').should('eq', '?search=tetris');

    cy.reload();

    searchField().should('have.value', 'tetris');
    listedRepos().should('have.length', 10);
    githubCalls().then((calls) => {
      expect(calls.at(-1)?.request.body.variables.name).to.eq('tetris');
    });
  });

  it('starts a new query from the first page', () => {
    stubGitHub();
    cy.visit('/?page=4');
    listedRepos().first().should('have.text', repoName(0, 30));

    searchField().type('tetris');

    // The old page number points into results that no longer exist, and so does
    // the cursor behind it.
    cy.location('search').should('eq', '?search=tetris');
    listedRepos().first().should('have.text', repoName(0, 0));
  });

  it('clears the search when the logo is clicked', () => {
    // The second face of the page-number bug: the same stale write put the old
    // query straight back into the address, so the logo did nothing.
    stubGitHub();
    cy.visit('/');
    searchField().type('tetris');
    cy.location('search').should('eq', '?search=tetris');

    cy.contains('Repo Explorer').click();

    cy.location('search').should('eq', '');
    searchField().should('have.value', '');
  });

  it('asks once for a word rather than once per keystroke', () => {
    stubGitHub();
    cy.visit('/');
    githubCalls().should('have.length', 1);

    searchField().type('tetris');
    cy.location('search').should('eq', '?search=tetris');
    listedRepos().should('have.length', 10);

    // One request for the landing list, one for the typed word. Six keystrokes,
    // six requests would mean the debounce is gone.
    githubCalls().should('have.length', 2);
  });

  it('says so when nothing matched', () => {
    stubGitHub({ totalCount: 0 });
    cy.visit('/?search=nothing-matches-this');

    cy.contains('Nothing found').should('be.visible');
    cy.get('[data-testid="repo-list"]').should('not.exist');
    cy.get('nav[aria-label="Pagination"]').should('not.exist');
  });
});
