describe('Todo App End-to-End Tests', () => {
  // Visit the home page before every test
  beforeEach(() => {
    cy.visit('http://localhost:4000');
    cy.viewport(1280, 800);
  });

  it('should login, navigate to dashboard, and add a new pending task', () => {
    // 1. We are on the Home Page. Click the login button in the Nav bar
    // Added .first() in case there is a mobile and desktop navigation login button
    cy.get('.nav-login').first().click({ force: true });

    // 2. We should now be on the Login page.
    cy.get('input[name="email"]').type('adeline@gmail.com');
    cy.get('input[name="password"]').type('12345');
    cy.get('button[type="submit"]').first().click({ force: true });

    // 3. After login, we should be redirected to the dashboard!
    cy.url().should('include', '/dashboard');

    // 4. On the dashboard, click the button to open the Add Task modal
    cy.get('.add-task-button').first().click({ force: true });

    // 5. NOW we can find the task input and type a task
    cy.get('.input-task').type('Buy groceries for the week');

    // 6. Find the description and type a description
    cy.get('#description').type('Milk, Eggs, Bread, and Coffee');

    // 7. Select the "Shopping" category via its ID
    cy.get('#shopping').first().click({ force: true });

    // 8. Select the date input and choose a date (e.g., 2024-12-31)
    cy.get('.input-date').type('2026-06-14');

    // 9. Select time input
    cy.get('.input-time').type('10:30');

    // 10. Submit the form by clicking the "Add New Task" button
    cy.get('.add-new-task').first().click({ force: true });

    // 11. click the category dropdown and select "Shopping"
    // Using { multiple: true, force: true } in case there are multiple category dropdowns rendered
    cy.get('#shopping-category').click({ force: true });

    // 12. click checkbox or mark test completed
    cy.get('.shopping-category-list').find('.complete-task-section').click();

    // 13. go to completed task page
    cy.get('.leftside-nav-ul li').contains('Completed Tasks').click();

    // 14. check if the completed task is visible in the completed task page
    cy.get('#shopping-category').click({ multiple: true, force: true });

    // 15. shpping visible
    cy.get('.shopping-category-list').should(
      'contain',
      'Buy groceries for the week'
    );

    // 16. go to all task page
    cy.get('.leftside-nav-ul li').contains('All Tasks').click({ force: true });

    // 17. chek the shopping category is visible in the all task page
    cy.get('#shopping-category').click({ multiple: true, force: true });

    // 18. check if the completed task is visible in the all task page
    cy.get('.shopping-category-list').should(
      'contain',
      'Buy groceries for the week'
    );

    // 19. delete the task
    cy.get('.shopping-category-list').find('.delete-task-section').click();

    // 20. check the total task
    cy.get('#shopping-category').first().should('contain', '0 Tasks');

    // B. finally check the google calender link
    cy.get('.add-task-button').first().click({ force: true });

    // 1.  NOW we can find the task input and type a task
    cy.get('.input-task').first().type('Buy groceries for the week');

    // 2. Find the description and type a description
    cy.get('#description').first().type('Milk, Eggs, Bread, and Coffee');

    // 3. Select the "Shopping" category via its ID
    cy.get('#shopping').first().click({ force: true });

    // 4. Select the date input and choose a date (e.g., 2024-12-31)
    cy.get('.input-date').first().type('2026-06-14');

    // 5. Select time input
    cy.get('.input-time').first().type('10:30');

    // 6. Submit the form by clicking the "Add New Task" button
    cy.get('.add-new-task').first().click({ force: true });

    // 7. click the category dropdown and select "Shopping"
    cy.get('#shopping-category').click();

    // 8. click the google calendar link
    cy.get('.shopping-category-list')
      .find('.calendar-task-section')
      .click({ multiple: true, force: true });
  });
});
