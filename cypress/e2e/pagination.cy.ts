import {
  githubCalls,
  listedRepos,
  pageButton,
  repoName,
  searchField,
  stubGitHub,
} from '../support/github';

describe('Pagination', () => {
  it('keeps the page number after the query was typed by hand', () => {
    stubGitHub();
    cy.visit('/');
    listedRepos().should('have.length', 10);

    searchField().type('tetris');
    cy.location('search').should('eq', '?search=tetris');

    pageButton('Page 2').click();

    cy.location('search').should('eq', '?search=tetris&page=2');
    cy.get('button[aria-current="page"]').should('have.text', '2');
    listedRepos().first().should('have.text', repoName(0, 10));
  });

  it('asks for the next window by cursor once the page leaves the first hundred', () => {
    stubGitHub();
    cy.visit('/?page=10');
    listedRepos().first().should('have.text', repoName(0, 90));
    githubCalls().should('have.length', 1);

    pageButton('Next page').click();

    // Page 11 is the first page of the second window, and the only way to reach
    // it is to send back the cursor the first window handed out.
    cy.location('search').should('eq', '?page=11');
    listedRepos().first().should('have.text', repoName(1, 0));
    githubCalls().should('have.length', 2);
    githubCalls().then((calls) => {
      expect(calls[0].request.body.variables.after).to.eq(null);
      expect(calls[1].request.body.variables.after).to.eq('cursor-0');
    });
  });

  it('pages back through a window already walked without asking again', () => {
    stubGitHub();
    cy.visit('/?page=11');
    listedRepos().first().should('have.text', repoName(1, 0));
    githubCalls().should('have.length', 2);

    pageButton('Previous page').click();

    cy.location('search').should('eq', '?page=10');
    listedRepos().first().should('have.text', repoName(0, 90));
    // Walking forward costs a request per window; walking back must not, which
    // is why the window cache outlives the default minute.
    githubCalls().should('have.length', 2);
  });

  it('stops at the last page GitHub will hand out, however much matched', () => {
    stubGitHub({ totalCount: 108368 });
    cy.visit('/');

    cy.contains('108,368 repositories found').should('be.visible');
    cy.contains('as deep as GitHub search goes').should('be.visible');

    // A hundred thousand matches, a thousand reachable, ten to a page.
    pageButton('Page 100').should('exist');
    pageButton('Page 101').should('not.exist');
  });

  it('offers no pagination when everything fits on one page', () => {
    stubGitHub({ totalCount: 7 });
    cy.visit('/');

    listedRepos().should('have.length', 7);
    cy.get('nav[aria-label="Pagination"]').should('not.exist');
  });

  it('leaves paging to elements the browser already knows how to operate', () => {
    // Tab focus, Enter, Space and the disabled state belong to the button
    // element. Cypress cannot reproduce that default - a synthetic `{enter}` on
    // a focused button fires no click - so what is asserted here is the element
    // type that earns the behaviour, and the absence of `pointer-events: none`,
    // which switches a control off for a mouse and for nothing else.
    stubGitHub();
    cy.visit('/');
    listedRepos().should('have.length', 10);

    pageButton('Page 2').should('have.prop', 'tagName', 'BUTTON');
    pageButton('Next page').should('have.prop', 'tagName', 'BUTTON');
    pageButton('Page 2').focus().should('have.focus');

    pageButton('Previous page')
      .should('be.disabled')
      .and('not.have.css', 'pointer-events', 'none');

    pageButton('Page 2').click();

    cy.location('search').should('eq', '?page=2');
    cy.get('button[aria-current="page"]').should('have.text', '2');
    pageButton('Previous page').should('not.be.disabled');
  });
});
