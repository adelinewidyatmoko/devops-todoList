describe('Todo App End-to-End Tests', () => {
  // Visit the home page before every test
  beforeEach(() => {
    cy.visit('http://localhost:4000');
    cy.viewport(1280, 800);
  });

  it('should login, navigate to dashboard, and add a new pending task', () => {
    // 1. We are on the Home Page. Click the login button in the Nav bar
    cy.get('.nav-login').click();

    // 2. We should now be on the Login page.
    // (Make sure these selectors match your actual login.ejs file)
    cy.get('input[name="email"]').type('adeline@gmail.com'); // Use a testing email
    cy.get('input[name="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    // 3. After login, we should be redirected to the dashboard!
    cy.url().should('include', '/dashboard');

    // 4. On the dashboard, click the button to open the Add Task modal
    cy.get('.add-task-button').click();

    // 5. NOW we can find the task input and type a task
    cy.get('.input-task').type('Buy groceries for the week');

    // 6. Find the description and type a description
    cy.get('#description').type('Milk, Eggs, Bread, and Coffee');

    // 7. Select the "Shopping" category via its ID
    cy.get('#shopping').click();

    // 8. Select the date input and choose a date (e.g., 2024-12-31)
    cy.get('.input-date').type('2026-06-06');

    // 9. Select time input
    cy.get('.input-time').type('10:30');

    // 8. Submit the form by clicking the "Add New Task" button
    cy.get('.add-new-task').click();

    // 9.click the category dropdown and select "Shopping"
    cy.get('#shopping-category').click({ force: true });

    //10. click checkbox or mark test completed
    cy.get('.shopping-category-list')
      .find('.complete-task-section')
      .click({ force: true });

    //11. go to completed task page
    cy.get('.leftside-nav-ul li').contains('Completed Tasks').click();

    //12. check if the completed task is visible in the completed task page
    cy.get('#shopping-category').click({ force: true });

    // 12a shpping visible
    cy.get('.shopping-category-list').should(
      'contain',
      'Buy groceries for the week'
    );

    //13. go to all task page
    cy.get('.leftside-nav-ul li').contains('All Tasks').click();

    //14 chek the shopping category is visible in the all task page
    cy.get('#shopping-category').click({ force: true });

    //15. check if the completed task is visible in the all task page
    cy.get('.shopping-category-list').should(
      'contain',
      'Buy groceries for the week'
    );

    //16 delete the task
    cy.get('.shopping-category-list').find('.delete-task-section').click();

    //17 check the total task
    cy.get('#shopping-category').should('contain', '0 Tasks');

    // B. finally check the google calender link
    cy.get('.add-task-button').click();

    // 1.  NOW we can find the task input and type a task
    cy.get('.input-task').type('Buy groceries for the week');

    // 2. Find the description and type a description
    cy.get('#description').type('Milk, Eggs, Bread, and Coffee');

    // 3. Select the "Shopping" category via its ID
    cy.get('#shopping').click();

    // 4. Select the date input and choose a date (e.g., 2024-12-31)
    cy.get('.input-date').type('2026-06-06');

    // 5. Select time input
    cy.get('.input-time').type('10:30');

    // 6. Submit the form by clicking the "Add New Task" button
    cy.get('.add-new-task').click();

    // 7. click the category dropdown and select "Shopping"
    cy.get('#shopping-category').click({ force: true });

    // 8. click the google calendar link
    cy.get('.shopping-category-list')
      .find('.calendar-task-section')
      .click({ force: true });
  });
});
