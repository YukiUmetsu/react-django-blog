// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload';

function strftime(sFormat, date) {
    if (!(date instanceof Date)) date = new Date();
    var nDay = date.getDay(),
        nDate = date.getDate(),
        nMonth = date.getMonth(),
        nYear = date.getFullYear(),
        nHour = date.getHours(),
        aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
        isLeapYear = function() {
            return (nYear%4===0 && nYear%100!==0) || nYear%400===0;
        },
        getThursday = function() {
            var target = new Date(date);
            target.setDate(nDate - ((nDay+6)%7) + 3);
            return target;
        },
        zeroPad = function(nNum, nPad) {
            return ((Math.pow(10, nPad) + nNum) + '').slice(1);
        };
    return sFormat.replace(/%[a-z]/gi, function(sMatch) {
        return (({
            '%a': aDays[nDay].slice(0,3),
            '%A': aDays[nDay],
            '%b': aMonths[nMonth].slice(0,3),
            '%B': aMonths[nMonth],
            '%c': date.toUTCString(),
            '%C': Math.floor(nYear/100),
            '%d': zeroPad(nDate, 2),
            '%e': nDate,
            '%F': date.toISOString().slice(0,10),
            '%G': getThursday().getFullYear(),
            '%g': (getThursday().getFullYear() + '').slice(2),
            '%H': zeroPad(nHour, 2),
            '%I': zeroPad((nHour+11)%12 + 1, 2),
            '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth>1 && isLeapYear()) ? 1 : 0), 3),
            '%k': nHour,
            '%l': (nHour+11)%12 + 1,
            '%m': zeroPad(nMonth + 1, 2),
            '%n': nMonth + 1,
            '%M': zeroPad(date.getMinutes(), 2),
            '%p': (nHour<12) ? 'AM' : 'PM',
            '%P': (nHour<12) ? 'am' : 'pm',
            '%s': Math.round(date.getTime()/1000),
            '%S': zeroPad(date.getSeconds(), 2),
            '%u': nDay || 7,
            '%V': (function() {
                var target = getThursday(),
                    n1stThu = target.valueOf();
                target.setMonth(0, 1);
                var nJan1 = target.getDay();
                if (nJan1!==4) target.setMonth(0, 1 + ((4-nJan1)+7)%7);
                return zeroPad(1 + Math.ceil((n1stThu-target)/604800000), 2);
            })(),
            '%w': nDay,
            '%x': date.toLocaleDateString(),
            '%X': date.toLocaleTimeString(),
            '%y': (nYear + '').slice(2),
            '%Y': nYear,
            '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
            '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
        }[sMatch] || '') + '') || sMatch;
    });
}

Cypress.Commands.add('adminLogin', (email = null, password = null) => {
    if(typeof email === 'undefined' || email === null){
        email = 'yuuki.umetsu@gmail.com';
    }

    if(typeof password === 'undefined' || password === null){
        password = '1qaz2wsx';
    }

    cy.visit('http://localhost:3000/admin-panel/login', {timeout: 15000});

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);

    cy.wait(1000);
    cy.get('form')
        .submit().debug();

    // we should be redirected to /dashboard
    cy.get("#sidebar", {timeout: 15000});
});

Cypress.Commands.add('newPost', (title = null) => {
    if(typeof title === 'undefined' || title === null){
        title = 'cypress-test-title';
    }
    cy.visit('http://localhost:3000/admin-panel/posts');
    cy.get("#new-post-btn").click();
    cy.get("input[name='title']").type(title);
    cy.get("input[name='excerpt']").type('cypress-test-excerpt');
    cy.get("select[name='category']").select('JLPT');
    cy.get("input[name='tags']").type('cytag1, cytag2');
    cy.get(".react-datepicker-wrapper input").type('05/11/2020 12:00 AM');
    cy.get(".sun-editor-editable").type('<p>this is cypress test!</p>');
    cy.get('input[name="main_img"]').attachFile('test-image.png');
    cy.wait(1000);
    cy.get('#save-btn').click();
    cy.wait(3000);
});

Cypress.Commands.add('newUser', (email = null, firstName = null, lastName = null) => {
    if(typeof firstName === 'undefined' || firstName === null){
        firstName = 'cypress-first';
    }
    if(typeof lastName === 'undefined' || lastName === null){
        lastName = 'cypress-last';
    }
    if(typeof email === 'undefined' || email === null){
        email = 'cypress-test'+ strftime('%m%d%H%M%S', new Date()) +'@gmail.com';
    }
    cy.visit('http://localhost:3000/admin-panel/users');
    cy.get("#add-new-user-btn").click();
    cy.wait(3000);
    cy.get("#new_user_form input[name='first_name']").type(firstName);
    cy.get("#new_user_form input[name='last_name']").type(lastName);
    cy.get('#new_user_form input[name="email"]').type(email);
    cy.get('#new_user_form input[name="password"]').type('YTZ1qaz2wsx!');
    cy.get('#new_user_form input[name="profile_img"]').attachFile('profile_img_test.jpg');
    cy.wait(1000);
    cy.get('#new_user_form').submit().debug();
    cy.wait(2000);
});