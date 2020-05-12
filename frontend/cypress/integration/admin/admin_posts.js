describe('Admin Posts Test', () => {
    Cypress.config('defaultCommandTimeout', 8000);
    Cypress.config('pageLoadTimeout', 10000);
    beforeEach(() => {
        cy.adminLogin();
    });

    // it('Test load table', () => {
    //     cy.visit('http://localhost:3000/admin-panel/posts');
    //     cy.get("#sidebar");
    //     cy.get("header");
    //     cy.wait(1000);
    //     cy.get('td');
    // });
    //
    it('Test create a new post', () => {
        cy.newPost();
    });

    it('Test editing a post', () => {
        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.get("#title").type('cypress-test-title{enter}');
        cy.wait(3000);
        cy.get('tbody>tr').as('rows');
        cy.get('@rows').eq(0).find('td:last-child>a.bg-teal-700').click();
        cy.wait(1500);
        cy.get("input[name='title']").as('title-input').clear();
        cy.wait(1000);
        cy.get('@title-input').type('cypress-test-title-changed');
        cy.wait(1000);
        cy.get('#save-btn').click();
        cy.wait(3000);
        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.wait(1000);
        cy.get("#title").type('cypress-test-title-changed{enter}');
        cy.wait(3000);
        cy.get('tbody>tr').should('have.length', 1);
    });

    it('Delete the created post', () => {
        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.get("#title").type('cypress-test-title{enter}');
        cy.wait(4000);
        cy.get('tr>td')
            .eq(1)
            .should('contain', 'cypress-test-title');
        cy.get(".table-actions")
            .find("a.bg-red-700")
            .first()
            .click();
        cy.wait(3000);
        cy.get("#delete-item button.alert-confirm").click();
        cy.wait(2000);

        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.get("#title").type('cypress-test-title{enter}');
        cy.wait(1500);
        cy.get('tbody>tr:first-child>td').eq(4).should('not.contain', 'cypress-test');
    });

    it('Delete multiple posts', () => {
        cy.newPost('cypress-test-post1');
        cy.newPost('cypress-test-post2');
        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.get("#title").type('cypress-test-post{enter}');
        cy.wait(3000);
        cy.get('tbody>tr').as('rows');
        cy.get('@rows').eq(0).find('td>input').check();
        cy.get('@rows').eq(1).find('td>input').check();
        cy.get('#multi-action-confirm-btn').click();
        cy.wait(3000);
        cy.get("#delete-multi-items button.alert-confirm").click({force: true});
        cy.wait(2000);

        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.get("#title").type('cypress-test-title{enter}');
        cy.wait(1500);
        cy.get('tbody>tr:first-child>td').eq(4).should('not.contain', 'cypress-test');
    });
});