describe("Task 2", () => {
  beforeEach(() => {
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")
    cy.intercept("POST", "https://api.skypicker.com/umbrella/v2/graphql*").as(
      "getRates"
    )
  })

  // V 5. bode skús vybrať náhodnú picture card namiesto prvej.
  it("Click a random Picture Card in 'Popular destinations' instead of the first one", () => {
    cy.getRandomPictureCard().click()
    cy.wait("@getRates")

    cy.step("Check the pathname pattern after re-direct")
    cy.location("pathname").should("match", /\/search\/results\//)
  })

  /* V 6. bode skontroluj, že si:
      bol/a presmerovaný/á so status kódom 200,
      url, na ktorú si bol/a presmerovaný/á, je rovnaká, ako href atribút elementu picture card, na ktorú si klikol/a,
      bol zavolaný API call, kde boli správne aplikované filtre a dostali sme nejakú odpoveď. */
  it("Check re-direct status code", () => {
    cy.intercept("GET", "**/search/results/**").as("redirect")
    cy.getRandomPictureCard().click()
    cy.wait("@redirect").its("response.statusCode").should("eq", 200)
    cy.location("pathname").should("match", /\/search\/results\//)
  })

  it("Check re-direct URL matches the value of href attribute of the Picture Card", () => {
    cy.getRandomPictureCard()
    cy.get("@randomPictureCard").invoke("prop", "href").as("hrefPropValue")

    cy.intercept("GET", "**/search/results/**").as("redirect")

    cy.get("@randomPictureCard").click()
    cy.wait("@redirect").its("response.statusCode").should("eq", 200)

    cy.url().then(function (url) {
      cy.log(url)
      cy.log(this.hrefPropValue)

      expect(url).to.be.equal(this.hrefPropValue)
    })
  })

  it("Check API call has correct filters applied and response is sent back to client from server", () => {
    cy.getRandomPictureCard().click()
    cy.wait("@getRates").then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
      expect(interception.response.body).to.exist

      const { search } = interception.request.body.variables
      const origin = search.itinerary.source
      const destination = search.itinerary.destination

      expect(origin.ids).to.have.length(1)
      expect(destination.ids).to.have.length(1)
    })
  })

  // V 9. bode pokračuj na rezervačný formulár z náhodného výsledku.
  it("Pick random result instead of first", () => {
    cy.getRandomPictureCard().click()
    cy.wait("@getRates")

    cy.step("Check the pathname pattern after re-direct")
    cy.location("pathname").should("match", /\/search\/results\//)

    cy.step("Verify result list is rendered")
    cy.getDataTest("ResultList-results", { timeout: 15_000 })
      .should("exist")
      .and("be.visible")

    cy.step("Get number of the results")
    cy.getDataTest("ResultCardWrapper").its("length").as("numberOfResults")

    cy.step("Choose one of the results at random")
    cy.then(function () {
      expect(this.numberOfResults).to.be.gte(1)
      const randomIndex = Math.floor(Math.random() * this.numberOfResults)
      cy.log("Randomly chose to click Result number " + (randomIndex + 1))
      cy.getDataTest("ResultCardWrapper")
        .eq(randomIndex)
        .as("randomResult")
        .scrollIntoView({ offset: { top: 100 } })
    })
    cy.get("@randomResult").within(() => {
      cy.contains("Select").click()
    })

    cy.step("Opt to continue as guest (no registration)")
    cy.getDataTest("MagicLogin-RequiredLogin")
      .should("be.visible")
      .within(() => {
        cy.contains("Continue as a guest").click()
      })

    cy.step("Verify new URL by spattern")
    cy.location("pathname", { timeout: 15_000 }).should("match", /\/*\/booking/)

    cy.step("Check the key elements on the page are rendered")
    cy.get("nav").should("have.length", 2).and("be.visible")
    cy.getDataTest("Reservation-content").should("be.visible")
    cy.getDataTest("ReservationHead").should("be.visible")
  })
})
