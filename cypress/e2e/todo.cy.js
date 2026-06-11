describe('Todo App End-to-End Tests', () => {
  let email;
  let password;

  before(() => {
    email = `test_${Date.now()}@example.com`;
    password = 'Password123';
  });

  // Visit the home page before every test
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 800);
  });

  it('should login, navigate to dashboard, and add a new pending task', () => {
    // 1. We are on the Home Page. Click the Sign Up button in the Nav bar
    cy.get('.nav-register').first().click({ force: true });

    // 2. We should now be on the Register page. Fill out the registration details:
    cy.get('input[name="name"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').first().click({ force: true });

    // 3. After registering, we should be redirected to the login page. Log in:
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').first().click({ force: true });

    // 4. After login, we should be redirected to the dashboard!
    cy.url().should('include', '/dashboard');

    // 5. On the dashboard, click the button to open the Add Task modal
    cy.get('.add-task-button').first().click({ force: true });

    // 6. NOW we can find the task input and type a task
    cy.get('.input-task').type('Buy groceries for the week');

    // 7. Find the description and type a description
    cy.get('#description').type('Milk, Eggs, Bread, and Coffee');

    // 8. Select the "Shopping" category via its ID
    cy.get('#shopping').first().click({ force: true });

    // 9. Select the date input and choose a date (e.g., 2026-06-30)
    cy.get('.input-date').type('2026-06-30');

    // 10. Select time input
    cy.get('.input-time').type('10:30');

    // 11. Submit the form by clicking the "Add New Task" button
    cy.get('.add-new-task').first().click({ force: true });

    // 12. click the category dropdown and select "Shopping"
    cy.get('#shopping-category').click({ force: true });

    // 13. click checkbox or mark test completed
    cy.get('.shopping-category-list').find('.complete-task-section').click();

    // 14. go to completed task page
    cy.get('.leftside-nav-ul li').contains('Completed Tasks').click();

    // 15. check if the completed task is visible in the completed task page
    cy.get('#shopping-category').click({ multiple: true, force: true });

    // 16. shopping visible
    cy.get('.shopping-category-list').should(
      'contain',
      'Buy groceries for the week'
    );

    // 17. go to all task page
    cy.get('.leftside-nav-ul li').contains('All Tasks').click({ force: true });

    // 18. check the shopping category is visible in the all task page
    cy.get('#shopping-category').click({ multiple: true, force: true });

    // 19. check if the completed task is visible in the all task page
    cy.get('.shopping-category-list').should(
      'contain',
      'Buy groceries for the week'
    );

    // 20. delete the task
    cy.get('.shopping-category-list').find('.delete-task-section').click();

    // 21. check the total task
    cy.get('#shopping-category').first().should('contain', '0 Tasks');

    // B. finally check the google calendar link
    cy.get('.add-task-button').first().click({ force: true });

    // 1.  NOW we can find the task input and type a task
    cy.get('.input-task').first().type('Buy groceries for the week');

    // 2. Find the description and type a description
    cy.get('#description').first().type('Milk, Eggs, Bread, and Coffee');

    // 3. Select the "Shopping" category via its ID
    cy.get('#shopping').first().click({ force: true });

    // 4. Select the date input and choose a date (e.g., 2026-06-30)
    cy.get('.input-date').first().type('2026-06-30');

    // 5. Select time input
    cy.get('.input-time').first().type('10:30');

    // 6. Submit the form by clicking the "Add New Task" button
    cy.get('.add-new-task').first().click({ force: true });

    // 7. click the category dropdown and select "Shopping"
    cy.get('#shopping-category').click();

    // 8. click the google calendar link
    cy.get('.shopping-category-list')
      .find('.calendar-task-section')
      .click({ force: true });
  });
});
