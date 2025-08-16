describe('Home Page', () => {
  it('loads successfully', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Welcome to Otter Music 🎵').not();
    cy.contains('Text To Melodies');
    cy.contains('Workbench');
    cy.wait(2000)
    cy.contains('Welcome to Otter Music 🎵');
    cy.scrollTo(0, 800)
    cy.contains('About OtterMusic 🦦')

  });

  it('contains all the required components and links (logged out)', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Watch App Demo!')
    cy.get('.footerLinks').should("have.attr", 'href').and('include', 'https://www.youtube.com/watch?v=4Mhr0mnvh_8')
    cy.get("a.footerLinks")
    cy.contains("Login")
    cy.get('#logIn').click()
    cy.url().should('contain', 'login')
    cy.get('button').should('eq', "Back")
  });
});