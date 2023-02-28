describe("Task 1 parts 1-4", () => {
  beforeEach(() => {
    cy.suppressCookieAndSubscriptionDialogs()
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")
  })

  it("Check that the number of elements on the page matches expectation", () => {
    cy.get("[data-test]").should("have.length", 109).and("be.visible")
  })

  it("Check nav bar", () => {
    cy.getDataTest("NavBar").should("have.length", 1).should("be.visible")
  })

  it("Check both maps are visible", () => {
    cy.get("[alt='Map']")
      .should("have.length", 2)
      .should("exist")
      .and("be.visible")
  })

  it("Check 'From' destination is correctly pre-filled", () => {
    cy.getDataTest("PlacePickerInput-origin")
      .should("be.visible")
      .children()
      .first()
      .should("contain", "Barcelona BCN")
  })

  it("Check H1 element's text", () => {
    cy.get("h1")
      .should("have.length", 1)
      .should("have.text", "Barcelona–El Prat (BCN)")
  })
})
