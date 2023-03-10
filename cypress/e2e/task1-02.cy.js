describe("Task 1 parts 5-8", () => {
  it("Click the first Picture Card in 'Popular destinations' section and verify the URL after re-direct", () => {
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")

    cy.step("Click the first picture card")
    cy.getDataTest("TrendingDestinations")
      .find("[data-test='PictureCard']")
      .first()
      .click()

    cy.step("Check the pathname pattern after re-direct")
    cy.location("pathname", { timeout: 10_000 }).should(
      "match",
      /\/search\/results\//
    )
  })

  it("Check the search form is correctly pre-filled with origin and destination", () => {
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")

    cy.step("Setup application state")
    cy.getDataTest("TrendingDestinations")
      .find("[data-test='PictureCard']")
      .first()
      .click()

    cy.location("pathname", { timeout: 10_000 }).should(
      "match",
      /\/search\/results\//
    )

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
  })

  it("Add one cabin bag and verify the results price changed", () => {
    cy.step("Arrange Application state")
    cy.intercept("POST", "https://api.skypicker.com/umbrella/v2/graphql*").as(
      "getRates"
    )
    cy.visit("/search/results/barcelona-spain/ibiza-spain/")
    cy.wait("@getRates")
    cy.step("Wait for results list so that test can continue")
    cy.getDataTest("ResultList-results", { timeout: 15_000 })
      .should("exist")
      .and("be.visible")

    cy.step("Save current price with no baggage")
    cy.get('strong[data-test="ResultCardPrice"]')
      .eq(0)
      .children()
      .invoke("text")
      .as("originalPrice")

    cy.step("Add one Cabin bagage")
    cy.getDataTest("BagsPopup-cabin")
      .should("have.length", 1)
      .and("be.visible")
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
