describe("Task 2 part 1", () => {
  // V 5. bode skús vybrať náhodnú picture card namiesto prvej.
  it.skip("Click a random Picture Card in 'Popular destinations' instead of the first one", () => {
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")

    cy.step("Get all the picture cards")
    cy.getDataTest("TrendingDestinations")
      .find("[data-test='PictureCard']")
      .its("length")
      .as("numberOfCards")

    cy.step("Choose one picture card at random")
    cy.then(function () {
      expect(this.numberOfCards).to.be.gte(1)
      const randomIndex = Math.floor(Math.random() * this.numberOfCards)
      cy.log("Randomly chose to click Card number " + (randomIndex + 1))
      cy.getDataTest("PictureCard")
        .eq(randomIndex)
        .as("randomlySelectedPictureCard")
        .scrollIntoView()
    })
    cy.intercept("POST", "https://api.skypicker.com/umbrella/v2/graphql*").as(
      "getRates"
    )
    cy.get("@randomlySelectedPictureCard").click()
    cy.wait("@getRates")

    cy.step("Check the pathname pattern after re-direct")
    cy.location("pathname").should("match", /\/search\/results\//)
  })

  /* V 6. bode skontroluj, že si:
bol/a presmerovaný/á so status kódom 200,
url, na ktorú si bol/a presmerovaný/á, je rovnaká, ako href atribút elementu picture card, na ktorú si klikol/a,
bol zavolaný API call, kde boli správne aplikované filtre a dostali sme nejakú odpoveď. */
  it("Check re-direct status code", () => {
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")

    cy.intercept("GET", "**/search/results/**").as("redirect")

    cy.getDataTest("TrendingDestinations")
      .find("[data-test='PictureCard']")
      .first()
      .click()

    cy.wait("@redirect").its("response.statusCode").should("eq", 200)
    cy.location("pathname").should("match", /\/search\/results\//)
  })

  it.only("Check re-direct URL matches the value of href attribute of the Picture Card", () => {
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")

    cy.getDataTest("TrendingDestinations")
      .find("[data-test='PictureCard']")
      .first()
      .as("pictureCardToClick")
      .invoke("prop", "href")
      .as("hrefPropValue")

    cy.intercept("GET", "**/search/results/**").as("redirect")

    cy.get("@pictureCardToClick").click()
    cy.wait("@redirect").its("response.statusCode").should("eq", 200)

    cy.url().then(function (url) {
      cy.log(url)
      cy.log(this.hrefPropValue)

      expect(url).to.be.equal(this.hrefPropValue)
    })
  })
  //   Cypress._.times(10, () => {
  // })

  it("Check API call has correct filters applied and response it sent back to client from server", () => {})
})
