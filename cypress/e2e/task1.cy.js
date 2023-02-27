describe("template spec", () => {
  beforeEach(() => {
    cy.suppressCookieAndSubscriptionDialogs()
    cy.visit("/en/airport/bcn/barcelona-el-prat-barcelona-spain/")
  })

  it("search form je origin správne nastavený na Barcelona BCN", () => {})
  it("H1 element má správny text “Barcelona–El Prat (BCN)", () => {})
  it("V sekcii “ Popular destinations from Barcelona–El Prat (BCN)” klikni na prvú picture card. Skontroluj, že si bol/a presmerovaný/á na stránku search/results so správne vyplneným search form.", () => {})
  it("All site sections and map should be visible", () => {})
})
