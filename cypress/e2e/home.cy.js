describe('Home Page', () => {
  it('loads successfully', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Welcome to Otter Music 🎵').not();
    cy.contains('Text To Melodies');
    cy.contains('Text To Playlist');
    cy.wait(2000)
    cy.contains('Welcome to Otter Music 🎵');
  });

  it('loads successfully', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Welcome to Otter Music 🎵').not();
    cy.wait(2000)
    cy.contains('Welcome to Otter Music 🎵');
  });
});