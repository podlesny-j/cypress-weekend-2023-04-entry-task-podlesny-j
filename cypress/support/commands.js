Cypress.Commands.add("suppressCookieAndSubscriptionDialogs", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("subscriptionFormSeen", 1)
  })
  cy.setCookie("__kwc_agreed", "false")
})
