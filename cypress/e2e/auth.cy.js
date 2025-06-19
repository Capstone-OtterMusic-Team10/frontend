describe("Authentication Pages", ()=>{
    it('check the login page (logged out)', () => {
        cy.visit('http://localhost:5173/login'); 
        cy.get("[type='email']").should('exist')
        cy.get("[type='email']").type("testemail@test.com")
        cy.get("[type='password']").type("test123")
        cy.get("[type='submit']").should('exist')
        cy.get("[type='submit']").click()
        cy.contains('Invalid credentials')
  });
})