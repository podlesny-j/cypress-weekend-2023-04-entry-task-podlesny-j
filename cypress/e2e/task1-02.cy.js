describe("Task 1 parts 5-8", () => {
  beforeEach(() => {
    cy.suppressCookieAndSubscriptionDialogs()
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")
  })

  it("V sekcii “ Popular destinations from Barcelona–El Prat (BCN)” klikni na prvú picture card. Skontroluj, že si bol/a presmerovaný/á na stránku search/results so správne vyplneným search form.", () => {
    cy.getDataTest("TrendingDestinations").within(() => {
      cy.get("h2").should(
        "contain.text",
        "Popular destinations from Barcelona–El Prat (BCN)"
      )
      cy.getDataTest("PictureCard").first().click()
    })

    cy.get(".bOFZIR", { timeout: 10000 }).should("not.exist")

    cy.location("pathname").should("match", /\/search\/results\//)
  })

  it.only("Skontroluj, že si bol/a presmerovaný/á na stránku search/results so správne vyplneným search form", () => {
    cy.step(
      "Section 'Popular destinations' should contain picture cards of the destination"
    )
    cy.getDataTest("TrendingDestinations").within(() => {
      cy.get("h2").should(
        "contain.text",
        "Popular destinations from Barcelona–El Prat (BCN)"
      )
      cy.getDataTest("PictureCard").first().click()
    })

    cy.step("Wait until the loading element no longer exists")
    cy.get(".bOFZIR", { timeout: 10000 }).should("not.exist")

    cy.step("Verify URL after re-direct")
    cy.location("pathname").should("match", /\/search\/results\//)

    cy.step("Check pre-filled value of origin")
    cy.getDataTest("PlacePickerInput-origin")
      .should("be.visible")
      .children()
      .first()
      .should("contain.text", "Barcelona")

    cy.step("Check pre-filled value of destination")
    cy.getDataTest("PlacePickerInput-destination")
      .should("be.visible")
      .children()
      .first()
      .should("contain.text", "Ibiza")

    cy.step("Save current price with no baggage")
    cy.get('strong[data-test="ResultCardPrice"]')
      .eq(0)
      .children()
      .invoke("text")
      .as("originalPrice")

    cy.step("Add one Cabin bagage")
    cy.intercept("POST", "https://api.skypicker.com/umbrella/v2/graphql*").as(
      "getRates"
    )
    cy.getDataTest("BagsPopup-cabin")
      .should("be.visible")
      .within(() => {
        cy.get('button[aria-label="increment"]').click()
      })
    cy.wait("@getRates")

    cy.step(
      "Verify new results have been fetched and the displayed price has been updated"
    )
    cy.get('strong[data-test="ResultCardPrice"]')
      .eq(0)
      .children()
      .invoke("text")
      .as("updatedPrice")
    cy.then(function () {
      expect(this.updatedPrice).to.not.equal(this.originalPrice)
    })
  })
})
