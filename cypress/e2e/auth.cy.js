describe("Authentication Activities", ()=>{
    it('check the login page logged out, wrong auth', () => {
      // failed log in
        cy.visit('http://localhost:5173/login'); 
        cy.get("[type='email']").should('exist')
        cy.get("[type='email']").type("testemail@test.com")
        cy.get("[type='password']").type("test123")
        cy.get("[type='submit']").should('exist')
        cy.get("[type='submit']").click()
        cy.contains('Invalid credentials')

        // use the music generator while logged out
        cy.visit('http://localhost:5173/')
        cy.get('button').contains('Text To Melodies').click()
        // cy.get('textarea').type('Generate an inspiring song that is perfect for a morning run')
        // cy.get("#otterForButton").click()
        // cy.wait(35000)
        // cy.get('audio').should('exist')
        // cy.reload()
        // cy.get('audio').should('not.exist')
  });
    it('check the login page logged out, correct auth', ()=>{
      cy.visit('http://localhost:5173/login'); 
      cy.get("[type='email']").should('exist')
      cy.get("[type='email']").type("fake@fake.com")
      cy.get("[type='password']").type("abc123")
      cy.get("[type='submit']").should('exist')
      cy.get("[type='submit']").click()
      cy.url().should("eq", "http://localhost:5173/")
      
    })
})