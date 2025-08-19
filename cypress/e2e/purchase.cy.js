describe('Purchase flow', () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    cy.contains('h1', 'TechStore').should('be.visible')
})

  it('Validate the flow of purchase with a value of less than $500,00', () => {
    cy.get(':nth-child(4) > .product-info > .add-to-cart-btn').click()
    cy.get('.success-message > .btn').click()
    cy.get('.checkout-btn').click()

    cy.get('.success-message').should('contain', 'Purchase Complete!')
  })

  it('Validate the flow of purchase with a value of more than $500,00 with valid credentials', () => {
    cy.get(':nth-child(3) > .product-info > .add-to-cart-btn').click()
    cy.get('.success-message > .btn').click()
    cy.get('.checkout-btn').click()

    cy.get('.auth-notice').should('contain',  'Login required for purchases $500.00 or more')

    cy.get('#loginForPurchase').click()

    cy.get('#email').type('test@test.com')
    cy.get('#password').type('test123')
 

    cy.get('.form-actions > .btn-primary').click()
    cy.get('.checkout-btn').click()

    cy.get('.success-message').should('contain', 'Purchase Complete!').should('be.visible')

  })

  it('Validate the flow of purchase with a value of more than $500,00 with invalid credentials', () => {
    cy.get(':nth-child(3) > .product-info > .add-to-cart-btn').click()
    cy.get('.success-message > .btn').click()
    cy.get('.checkout-btn').click()

    cy.get('.auth-notice').should('contain',  'Login required for purchases $500.00 or more')

    cy.get('#loginForPurchase').click()

    cy.get('#email').type('error@test.com')
    cy.get('#password').type('test')
 
    cy.get('.form-actions > .btn-primary').click()
    cy.get('#loginError').should('contain', 'Invalid credentials').should('be.visible')

  })

})