describe('Admin Posts Test', () => {
    Cypress.config('defaultCommandTimeout', 8000);
    Cypress.config('pageLoadTimeout', 10000);
    beforeEach(() => {
        cy.adminLogin();
    });

    it('Test load table', () => {
        cy.visit('http://localhost:3000/admin-panel/users');
        cy.get("#sidebar");
        cy.get("header");
        cy.wait(1000);
        cy.get('td');
    });

    it('Test create a new user', () => {
        cy.newUser();
    });

    it('Test editing a user', () => {
        cy.visit('http://localhost:3000/admin-panel/users');
        cy.get("#email").type('cypress-test{enter}');
        cy.wait(2000);
        cy.get('tbody>tr').as('rows');
        cy.get('@rows').eq(0).find('td:last-child>a.bg-teal-700').click();
        cy.wait(1500);
        cy.get("#object-edit-form input[name='first_name']").clear().type('cy-first-changed');
        cy.get('#object-edit-form').submit().debug();
        cy.wait(3000);
        cy.reload();
        cy.get("#first_name").type('cy-first-changed{enter}');
        cy.get('td');

    });

    it('Delete the created user', () => {
        cy.visit('http://localhost:3000/admin-panel/users');
        cy.get("#email").type('cypress-test{enter}');
        cy.wait(3000);
        cy.get('tr>td')
            .eq(4)
            .should('contain', 'cypress-test');
        cy.get(".table-actions")
            .find("a.bg-red-700")
            .first()
            .click();
        cy.wait(3000);
        cy.get("#delete-item button.alert-confirm").click();
        cy.wait(1000);
        cy.visit('http://localhost:3000/admin-panel/users');
        cy.get("#email").type('cypress-test{enter}');
        cy.wait(1500);
        cy.get('tbody>tr:first-child>td').eq(4).should('not.contain', 'cypress-test');
    });

    it('Delete multiple users', () => {
        cy.newUser();
        cy.newUser();
        cy.visit('http://localhost:3000/admin-panel/users');
        cy.get("#email").type('cypress-test{enter}');
        cy.wait(2000);
        cy.get('tbody>tr').as('rows');
        cy.get('@rows').eq(0).find('td>input').check();
        cy.get('@rows').eq(1).find('td>input').check();
        cy.get('#multi-action-confirm-btn').click();
        cy.wait(3000);
        cy.get("#delete-multi-items button.alert-confirm").click({force: true});
        cy.wait(1000);
        cy.visit('http://localhost:3000/admin-panel/users');
        cy.get("#email").type('cypress-test{enter}');
        cy.wait(1500);
        cy.get('tbody>tr:first-child>td').eq(4).should('not.contain', 'cypress-test');
    });
});