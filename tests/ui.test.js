const { test, expect } = require("@playwright/test");
const host = "http://localhost:3000";
const loginPage = `${host}/login`;
const catalogPage = `${host}/catalog`;
const myBooksPage = `${host}/profile`;
const registerPage = `${host}/register`;
const addBookPage = `${host}/create`;
const navbarSelector = "nav.navbar";
const catalogLinkSelector = 'a[href="/catalog"]';
const loginButtonSelector = 'a[href="/login"]';
const registerButtonSelector = 'a[href="/register"]';
const logoutButtonSelector = "#logoutBtn";
const username = "peter@abv.bg";
const password = "123456";
const myBooksSelector = 'a.button[href="/profile"]';
const addBookSelector = 'a.button[href="/create"]';
const userEmailSelector = "#user > span";
const addBookForm = "#create-form";
const errorMessage = "All fields are required!";
const passwordsErrorMessage = "Passwords don't match!";
const newUser = "test@abv.bg";
const newUserPass = "1234567";
const dashboardSelector = ".dashboard";
const dashboardBooksLiSelector = ".other-books-list li";
const noBooksMessage = "No books in database!";

//Guest tests
test('Verify "All Book" link is visible', async ({ page }) => {
  await page.goto(host);
  await page.waitForSelector(navbarSelector);
  const allBooksLink = await page.$(catalogLinkSelector);
  const isLinkVisible = await allBooksLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify "Login" button is visible', async ({ page }) => {
  await page.goto(host);
  await page.waitForSelector(navbarSelector);
  const loginButton = await page.$(loginButtonSelector);
  const isButtonVisible = await loginButton.isVisible();

  expect(isButtonVisible).toBe(true);
});

test('Verify "Register" button is visible', async ({ page }) => {
  await page.goto(host);
  await page.waitForSelector(navbarSelector);
  const registerButton = await page.$(registerButtonSelector);
  const isButtonVisible = await registerButton.isVisible();

  expect(isButtonVisible).toBe(true);
});

//Logged in tests
test('Verify "All Book" link is visible after login', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);
  await page.click("input[type=submit]");

  await page.waitForSelector(navbarSelector);
  const allBooksLink = await page.$(catalogLinkSelector);
  const isLinkVisible = await allBooksLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify "My Book" link is visible after login', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);
  await page.click("input[type=submit]");

  await page.waitForSelector(navbarSelector);
  const myBooksLink = await page.$(myBooksSelector);
  const isLinkVisible = await myBooksLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify "Add Book" link is visible after login', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);
  await page.click("input[type=submit]");

  await page.waitForSelector(navbarSelector);
  const addBookLink = await page.$(addBookSelector);
  const isLinkVisible = await addBookLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify user email address is visible after login', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);
  await page.click("input[type=submit]");

  await page.waitForSelector(navbarSelector);
  const userEmailElement = await page.$(userEmailSelector);
  const isVisible = await userEmailElement.isVisible();
  const userEmailElementText = await userEmailElement.textContent();

  expect(isVisible).toBe(true);
  expect(userEmailElementText).toContain(`Welcome, ${username}`);
});

//Login page tests
test('Login in with valid credentials', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);
  await page.click("input[type=submit]");

  await page.$(catalogLinkSelector);
  expect(page.url()).toBe(catalogPage);
});

test('Login in with an empty credentials', async ({ page }) => {
  await page.goto(loginPage);

  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(loginButtonSelector);
  expect(page.url()).toBe(loginPage);
});

test('Login in with an empty email field', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=password]", password);
  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(loginButtonSelector);
  expect(page.url()).toBe(loginPage);
});

test('Login in with an empty password field', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(loginButtonSelector);
  expect(page.url()).toBe(loginPage);
});

//Register page tests
test.skip('Register with valid credentials', async ({ page }) => {
  await page.goto(registerPage);

  await page.fill("input[name=email]", newUser);
  await page.fill("input[name=password]", newUserPass);
  await page.fill("input[name=confirm-pass]", newUserPass);
  await page.click("input[type=submit]");

  await page.$(catalogLinkSelector);
  expect(page.url()).toBe(catalogPage);
});

test('Register with an empty credentials', async ({ page }) => {
  await page.goto(registerPage);

  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(registerButtonSelector);
  expect(page.url()).toBe(registerPage);
});

test('Register with an empty email field and valid passwords', async ({ page}) => {
  await page.goto(registerPage);

  await page.fill("input[name=password]", newUserPass);
  await page.fill("input[name=confirm-pass]", newUserPass);
  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(registerButtonSelector);
  expect(page.url()).toBe(registerPage);
});

test('Register with an empty password field and valid email, confirm-password', async ({ page}) => {
  await page.goto(registerPage);

  await page.fill("input[name=email]", newUser);
  await page.fill("input[name=confirm-pass]", newUserPass);
  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(registerButtonSelector);
  expect(page.url()).toBe(registerPage);
});

test('Register with an empty confirm-password field and valid email and password', async ({page}) => {
  await page.goto(registerPage);

  await page.fill("input[name=email]", newUser);
  await page.fill("input[name=confirm-pass]", newUserPass);
  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(registerButtonSelector);
  expect(page.url()).toBe(registerPage);
});

test('Register with a valid email and different passwords', async ({
  page,
}) => {
  await page.goto(registerPage);

  await page.fill("input[name=email]", newUser);
  await page.fill("input[name=password]", newUserPass);
  await page.fill("input[name=confirm-pass]", `${newUserPass}9`);
  await page.click("input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(passwordsErrorMessage);
    await dialog.accept();
  });

  await page.$(registerButtonSelector);
  expect(page.url()).toBe(registerPage);
});

//Add book page tests
test.skip('Add book with correct data', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.click(addBookSelector);
  await page.waitForSelector(addBookForm);

  await page.fill("#title", "Test Book");
  await page.fill("#description", "Test Book description");
  await page.fill(
    "#image",
    "https://smartmobilestudio.com/wp-content/uploads/2012/06/leather-book-preview.png"
  );
  await page.selectOption("#type", "Other");
  await page.click("#create-form input[type=submit]");

  await page.waitForURL(catalogPage);
  expect(page.url()).toBe(catalogPage);
});

test('Add book with an empty title field', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.click(addBookSelector);
  await page.waitForSelector(addBookForm);

  await page.fill("#description", "Test Book description");
  await page.fill(
    "#image",
    "https://smartmobilestudio.com/wp-content/uploads/2012/06/leather-book-preview.png"
  );
  await page.selectOption("#type", "Other");
  await page.click("#create-form input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(addBookSelector);
  expect(page.url()).toBe(addBookPage);
});

test('Add book with an empty description field', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.click(addBookSelector);
  await page.waitForSelector(addBookForm);

  await page.fill("#title", "Test Book");
  await page.fill(
    "#image",
    "https://smartmobilestudio.com/wp-content/uploads/2012/06/leather-book-preview.png"
  );
  await page.selectOption("#type", "Other");
  await page.click("#create-form input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(addBookSelector);
  expect(page.url()).toBe(addBookPage);
});

test('Add book with an empty image field', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.click(addBookSelector);
  await page.waitForSelector(addBookForm);

  await page.fill("#title", "Test Book");
  await page.fill("#description", "Test Book description");
  await page.selectOption("#type", "Other");
  await page.click("#create-form input[type=submit]");

  page.on("dialog", async (dialog) => {
    expect(dialog.type().toContain("alert"));
    expect(dialog.message()).toContain(errorMessage);
    await dialog.accept();
  });

  await page.$(addBookSelector);
  expect(page.url()).toBe(addBookPage);
});

//All books page tests
test('Login and verify all books are displayed', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.waitForSelector(dashboardSelector);
  const booksElements = await page.$$(dashboardBooksLiSelector);

  expect(booksElements.length).toBeGreaterThan(0);
});

test.skip('Verify that no books are displayed', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.waitForSelector(dashboardSelector);
  const pageMessage = await page.textContent(".no-books");

  expect(pageMessage).toBe(noBooksMessage);
});

//Details page tests

//Logout tests
test('Verify "Logout" button is visible', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.waitForSelector(navbarSelector);
  const logoutLink = await page.$(logoutButtonSelector);
  const isLinkVisible = await logoutLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify "Logout" button redirects correctly', async ({ page }) => {
  await page.goto(loginPage);

  await page.fill("input[name=email]", username);
  await page.fill("input[name=password]", password);

  await Promise.all([
    page.click("input[type=submit]"),
    page.waitForURL(catalogPage),
  ]);

  await page.click(logoutButtonSelector);
  expect(page.url()).toBe(catalogPage);
});
