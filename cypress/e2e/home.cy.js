describe('Home Page', () => {
  it('loads successfully', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Welcome to Otter Music 🎵').not();
    cy.contains('Text To Melodies');
    cy.contains('Text To Playlist');
    cy.wait(2000)
    cy.contains('Welcome to Otter Music 🎵');
  });

  it('contains all the required components and links (logged out)', () => {
    cy.contains('Login')
    cy.get('.footer-button').click() 
    cy.url().should('include', '/about')
  });
});