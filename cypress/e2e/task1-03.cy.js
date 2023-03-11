describe("Task 1 parts 9-10", () => {
  beforeEach(() => {
    cy.intercept("POST", "https://api.skypicker.com/umbrella/v2/graphql*").as(
      "getRates"
    )
  })

  it("Proceed to Booking form, verify user is on the correct page ", () => {
    cy.section("Arrange")
    cy.visit("/search/results/barcelona-spain/ibiza-spain/")
    cy.step("Wait for results list so that test can continue")
    cy.wait("@getRates")
    cy.getDataTest("ResultList-results", { timeout: 15_000 })
      .should("exist")
      .and("be.visible")

    cy.getDataTest("PlacePickerInput-origin")
      .should("be.visible")
      .children()
      .first()
      .should("contain.text", "Barcelona")

    cy.getDataTest("PlacePickerInput-destination")
      .should("be.visible")
      .children()
      .first()
      .should("contain.text", "Ibiza")

    cy.section("Act")
    cy.step("Select the first result")
    cy.getDataTest("ResultCardWrapper")
      .first()
      .within(() => {
        cy.contains("Select").click()
      })

    cy.step("Opt to continue as guest (no registration)")
    cy.getDataTest("MagicLogin-RequiredLogin")
      .should("be.visible")
      .within(() => {
        cy.contains("Continue as a guest").click()
      })

    cy.section("Assert")
    cy.step("Verify new URL by pattern")
    cy.location("pathname", { timeout: 15_000 }).should("match", /\/*\/booking/)

    cy.step("Check the key elements on the page are rendered")
    cy.get("nav").should("have.length", 2).and("be.visible")
    cy.getDataTest("Reservation-content").should("be.visible")
    cy.getDataTest("ReservationHead").should("be.visible")
  })
})
