Cypress._.times(10, () => {
  describe("Task 2 part 1", () => {
    // V 5. bode skús vybrať náhodnú picture card namiesto prvej.
    it.skip("Click a random Picture Card in 'Popular destinations' instead of the first one", () => {
      cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")

      cy.step("Get all the picture cards")
      cy.getDataTest("TrendingDestinations")
        .find("[data-test='PictureCard']")
        .its("length")
        .as("numberOfCards")

      cy.step("Choose one picture card at random")
      cy.then(function () {
        expect(this.numberOfCards).to.be.gte(1)
        const randomIndex = Math.floor(Math.random() * this.numberOfCards)
        cy.log("Randomly chose to click Card number " + (randomIndex + 1))
        cy.getDataTest("PictureCard")
          .eq(randomIndex)
          .as("randomlySelectedPictureCard")
          .scrollIntoView()
      })
      cy.intercept("POST", "https://api.skypicker.com/umbrella/v2/graphql*").as(
        "getRates"
      )
      cy.get("@randomlySelectedPictureCard").click()
      cy.wait("@getRates")

      cy.step("Check the pathname pattern after re-direct")
      cy.location("pathname").should("match", /\/search\/results\//)
    })

    /* V 6. bode skontroluj, že si:
bol/a presmerovaný/á so status kódom 200,
url, na ktorú si bol/a presmerovaný/á, je rovnaká, ako href atribút elementu picture card, na ktorú si klikol/a,
bol zavolaný API call, kde boli správne aplikované filtre a dostali sme nejakú odpoveď. */

    it.only("Check re-direct status code", () => {
      cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")

      cy.step("Click picutre card)
      cy.getDataTest("TrendingDestinations")
        .find("[data-test='PictureCard']")
        .first()
        .click()

      cy.location("pathname", { timeout: 10_000 }).should(
        "match",
        /\/search\/results\//
      )
  })

    it("Check re-direct status code, re-direct URL matches the value of href attribute of the Picture Card, API call has correct filters applied and response it sent back to client from server", () => {

  })

    it("Check re-direct status code, re-direct URL matches the value of href attribute of the Picture Card, API call has correct filters applied and response it sent back to client from server", () => {

  })
})
