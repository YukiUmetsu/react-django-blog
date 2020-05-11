describe('Admin Posts Test', () => {
    Cypress.config('defaultCommandTimeout', 8000);
    Cypress.config('pageLoadTimeout', 10000);
    beforeEach(() => {
        cy.visit('http://localhost:3000/admin-panel/login', {timeout: 15000});

        cy.get('input[name="email"]').type('yuuki.umetsu@gmail.com');
        cy.get('input[name="password"]').type('1qaz2wsx');

        cy.wait(1000);
        cy.get('form')
            .submit().debug();

        // we should be redirected to /dashboard
        cy.get("#sidebar", {timeout: 15000});
    });

    it('Test load table', () => {
        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.get("#sidebar");
        cy.get("header");
        cy.wait(1000);
        cy.get('td');
    });

    it('Test create a new post', () => {
        cy.visit('http://localhost:3000/admin-panel/posts');
        cy.get("#new-post-btn").click();
        cy.get("input[name='title']").type('cypress-test-title');
        cy.get("input[name='excerpt']").type('cypress-test-excerpt');
        cy.get("select[name='category']").select('JLPT');
        cy.get("input[name='tags']").type('cytag1, cytag2');
        cy.get(".react-datepicker-wrapper input").type('05/11/2020 12:00 AM');
        cy.get(".sun-editor-editable").type('<p>this is cypress test!</p>');
        cy.get('input[name="main_img"]').attachFile('test-image.png');
        cy.wait(1000);
        cy.get('#save-btn').click();
        cy.wait(5000);
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
    });
});