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
      cy.getDataTest("PictureCard").first().click()
    })

    cy.get(".bOFZIR", { timeout: 10000 }).should("not.exist")

    cy.location("pathname").should("match", /\/search\/results\//)
  })

  it.only("Skontroluj, že si bol/a presmerovaný/á na stránku search/results so správne vyplneným search form", () => {
    cy.getDataTest("TrendingDestinations").within(() => {
      cy.get("h2").should(
        "contain.text",
        "Popular destinations from Barcelona–El Prat (BCN)"
      )
      cy.getDataTest("PictureCard").first().click()
    })

    cy.get(".bOFZIR", { timeout: 10000 }).should("not.exist")

    cy.location("pathname").should("match", /\/search\/results\//)

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

    // cy.step('7+8 Pridaj vo filtroch jednu príručnú batožinu.')
    cy.get('strong[data-test="ResultCardPrice"]')
      .eq(0)
      .children()
      .invoke("text")
      .as("originalPrice")

    cy.intercept("POST", "https://api.skypicker.com/umbrella/v2/graphql*").as(
      "getRates"
    )

    cy.getDataTest("BagsPopup-cabin")
      .should("be.visible")
      .within(() => {
        cy.get('button[aria-label="increment"]').click()
      })
    cy.wait("@getRates")

    cy.get('strong[data-test="ResultCardPrice"]')
      .eq(0)
      .children()
      .invoke("text")
      .as("updatedPrice")

    cy.step("8 Presvedč sa, že sa ti načítali nové výsledky.")
    cy.then(function () {
      expect(this.updatedPrice).to.not.equal(this.originalPrice)
    })
  })

})
