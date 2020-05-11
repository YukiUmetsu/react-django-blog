describe('Admin User Login Test', () => {
    it('Admin User Login Test', () => {

        cy.visit('http://localhost:3000/admin-panel/login', {timeout: 15000});

        cy.get('input[name="email"]').type('yuuki.umetsu@gmail.com');
        cy.get('input[name="password"]').type('1qaz2wsx');

        cy.wait(1000);
        cy.get('form')
            .submit().debug();
        cy.window().then((win) => {
            cy.spy(win.console, "log")
        });

        // we should be redirected to /dashboard
        cy.get("#sidebar");

        // our auth cookie should be present
        cy.getCookie('token').should('exist', {timeout: 15000});
    });
});