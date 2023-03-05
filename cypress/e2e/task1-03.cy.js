Cypress._.times(10, () => {
  describe("Task 1 parts 9-11", () => {
    function setupApplicationState() {
      cy.step("Arrange Application state")
      cy.getDataTest("TrendingDestinations").within(() => {
        cy.get("h2").should(
          "contain.text",
          "Popular destinations from Barcelona–El Prat (BCN)"
        )
        cy.getDataTest("PictureCard").first().click("bottomLeft")
      })

      cy.step("Wait for new URL")
      cy.location("pathname", { timeout: 10000 }).should(
        "match",
        /\/search\/results\//
      )
      cy.step("Wait for results list so that test can continue")
      cy.get("[data-test='ResultList-results']", { timeout: 15000 })
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

      cy.get("[data-test='ResultList-results']", { timeout: 15000 })
        .should("exist")
        .and("be.visible")
    }

    beforeEach(() => {
      cy.suppressCookieAndSubscriptionDialogs()
      cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")
    })

    it("Proceed to Booking form, verify user is on the correct page ", () => {
      setupApplicationState()
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

      cy.step("Verify new URL pattern")
      cy.location("pathname", { timeout: 10000 }).should(
        "match",
        /\/*\/booking/
      )

      cy.step("Check the key elements on the page are rendered")
      cy.getDataTest("Reservation-content").should("be.visible")

      cy.get("nav").should("have.length", 2).and("be.visible")

      cy.getDataTest("ReservationHead").should("be.visible")
    })
  })
})
