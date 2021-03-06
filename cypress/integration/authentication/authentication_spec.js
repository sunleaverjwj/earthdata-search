import { getByTestId } from '../../support/getByTestId'
import { getJwtToken } from '../../support/getJwtToken'

import collectionFixture from './authenticated_collections'

// At the default size, react-window will render 7 items
const expectedCollectionCount = 7

describe('Authentication', () => {
  it('logs the user in with the auth_callback endpoint and redirects the user', () => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '**/collections/json',
      response: collectionFixture.body,
      headers: collectionFixture.headers
    })

    cy.visit(`/auth_callback?jwt=${getJwtToken()}&redirect=http://localhost:8080/`)

    cy.contains('Earthdata Login').should('not.exist')
    getByTestId('collection-results-list')
      .should('not.be.empty')
      .children().should('have.length', expectedCollectionCount)
  })

  it('sets auth cookie', () => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '**/collections/json',
      response: collectionFixture.body,
      headers: collectionFixture.headers
    })

    cy.getCookies().should('be.empty')
    // See cypress/support/commands.js for cy.login command
    cy.login()
    cy.getCookie('authToken').should('exist')

    cy.visit('/')

    cy.contains('Earthdata Login').should('not.exist')
    getByTestId('collection-results-list')
      .should('not.be.empty')
      .children().should('have.length', expectedCollectionCount)
  })
})
