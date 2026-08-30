describe("App E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should be visible start page", () => {
    cy.get('[placeholder="Search GitHub Repo..."]').should("have.value", "");

    cy.contains("GitRepoFinder");

    cy.get('[data-testid="git-icon"]').should("be.visible");

    cy.intercept("POST", "https://api.github.com/graphql").as("graphqlRequest");

    cy.contains("Searching...").should("be.visible");

    cy.wait("@graphqlRequest", { timeout: 10000 });

    cy.get('[data-testid="repo-list"]').should('be.visible');

    cy.contains("GitRepoFinder").click();

    cy.get('[placeholder="Search GitHub Repo..."]').should("have.value", "");

    cy.contains("GitRepoFinder");

    cy.get('[data-testid="git-icon"]').should("be.visible");

    cy.get('[data-testid="repo-list"]').should('be.visible');
  });

  it("checking all buttons pagination", () => {
    cy.get('[placeholder="Search GitHub Repo..."]').type("tetris");

    cy.get('[placeholder="Search GitHub Repo..."]').should("have.value", "tetris");

    cy.intercept("POST", "https://api.github.com/graphql").as("graphqlRequest");

    cy.contains("Searching...").should("be.visible");

    cy.wait("@graphqlRequest", { timeout: 10000 });

    cy.get('[data-testid="repo-list"]').should("be.visible");

    cy.get('[data-testid="pagination-block"]').should("be.visible");

    cy.get('[data-testid="pagination-block"]').find('[class*="selected"]');

    for (let i = 1; i <= 10; i++) {
      cy.get('[data-testid="pagination-block"]')
        .find('[class*="selected"]')
        .should("contain.text", `${i}`);

      if (i === 10) {
        break;
      }
      cy.get('[data-testid="right-arrow"]').click();
    }

    for (let n = 10; n >= 1; n--) {
      cy.get('[data-testid="pagination-block"]')
        .find('[class*="selected"]')
        .should("contain.text", `${n}`);

      if (n === 1) {
        break;
      }

      cy.get('[data-testid="left-arrow"]').click();
    }
  });

  it("should find tetris repository and open about page", () => {
    cy.get('[placeholder="Search GitHub Repo..."]').type("tetris");

    cy.get('[placeholder="Search GitHub Repo..."]').should("have.value", "tetris");
    cy.wait(1000);

    cy.reload();

    cy.wait(10000);

    cy.get('[placeholder="Search GitHub Repo..."]').should("have.value", "tetris");

    cy.url().should("include", "/?search=tetris");

    cy.contains("More...")
      .invoke("attr", "href")
      .then((href) => {
        cy.contains("More...").invoke("removeAttr", "target").click();
        cy.intercept("POST", "https://api.github.com/graphql").as(
          "graphqlRequest"
        );

        cy.contains("Loading...").should(
          "be.visible"
        );

        cy.url().then((currentUrl) => {
          expect(currentUrl).to.include(href);
        });
        cy.contains("react-tetris").click();
      });

    cy.url().then((currentUrl) => {
      cy.window().then((win) => {
        win.localStorage.setItem("savedUrl", currentUrl);
      });

      cy.reload();

      cy.window().then((win) => {
        const savedUrl = win.localStorage.getItem("savedUrl");
        expect(currentUrl).to.equal(savedUrl);
      });

      cy.contains("Loading...").should(
        "be.visible"
      );

      cy.contains("react-tetris").should("be.visible");

      cy.contains("JavaScript").should("be.visible");

      cy.contains("HTML").should("be.visible");

      cy.contains("CSS").should("be.visible");

      cy.contains("GitRepoFinder").click();

      cy.get('[placeholder="Search GitHub Repo..."]').should("have.value", "");
    });
  });
});
