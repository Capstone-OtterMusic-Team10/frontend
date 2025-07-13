describe('Home Page', () => {
  it('loads successfully', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Welcome to Otter Music 🎵').not();
    cy.contains('Text To Melodies');
    cy.contains('Workbench');
    cy.wait(2000)
    cy.contains('Welcome to Otter Music 🎵');
  });

  it('contains all the required components and links (logged out)', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('About')
    cy.get('.footer-button').click() 
    cy.url().should('include', '/about')
    cy.contains("Login")
    cy.get('#logIn').click()
    cy.url().should('contain', 'login')
  });
});