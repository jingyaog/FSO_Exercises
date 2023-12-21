describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click()
      cy.get('[data-cy="username"]').type('mluukkai')
      cy.get('[data-cy="password"]').type('salainen')
      cy.get('[data-cy="login"]').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('[data-cy="username"]').type('mluukkai')
      cy.get('[data-cy="password"]').type('wrong')
      cy.get('[data-cy="login"]').click()
      cy.get('[data-cy="notification"]')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title-input').type('New test blog')
      cy.get('#author-input').type('Aaron')
      cy.get('#url-input').type('http://www.google.com')
      cy.get('[data-cy="create-button"]').click()

      cy.get('[data-cy="notification"]')
        .should('contain', 'a new blog New test blog by Aaron added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.contains('New test blog Aaron')
    })

    it.only('A user can like a blog', function () {
      cy.createBlog({
        title: 'New test blog',
        author: 'Aaron',
        url: 'http://www.google.com'
      })
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })
  })
})