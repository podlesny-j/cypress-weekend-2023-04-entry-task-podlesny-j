describe("Task 1 parts 5-?", () => {
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
      cy.getDataTest("PictureCard").its("length").as("numberOfCards")
    })

    cy.then(function () {
      expect(
        this.numberOfCards,
        "Number of PictureCards was less than 1. That should never happen."
      ).to.be.gte(1)
      const randomIndex = Math.floor(Math.random() * this.numberOfCards)
      cy.log("Randomly chose to click Card number " + (randomIndex + 1))
      cy.getDataTest("PictureCard").eq(randomIndex).click()
    })
  })

  // cy.intercept('GET', '*/search/results/*)
})
