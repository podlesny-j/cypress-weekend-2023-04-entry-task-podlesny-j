Cypress.Commands.add("suppressCookieAndSubscriptionDialogs", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("subscriptionFormSeen", 1)
  })
  cy.setCookie("__kwc_agreed", "false")
})

Cypress.Commands.add("getDataTest", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})


Cypress.Commands.add("getFirstPictureCard", () => {
  cy.step("Get first picture card in the TrendingDestinations section")
  cy.getDataTest("TrendingDestinations")
    .find("[data-test='PictureCard']")
    .first()
    .as("firstPictureCard")
    .scrollIntoView()
    .should("be.visible")
})

Cypress.Commands.add("getRandomPictureCard", () => {
  cy.step("Get total number of the picture cards on page")
  cy.getDataTest("TrendingDestinations")
    .find("[data-test='PictureCard']")
    .its("length")
    .as("numberOfCards")

  cy.step("Choose one of the picture cards at random")
  cy.then(function () {
    expect(this.numberOfCards).to.be.gte(1)
    const randomIndex = Math.floor(Math.random() * this.numberOfCards)
    cy.log("Randomly chose to click Card number " + (randomIndex + 1))
    cy.getDataTest("PictureCard")
      .eq(randomIndex)
      .as("randomPictureCard")
      .scrollIntoView()
      .should("be.visible")
  })
})