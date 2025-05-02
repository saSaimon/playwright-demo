import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { InventoryLocators } from '../locators/inventory.locators';
import { BASE_URL } from '../test-data/test.config';
import { CheckoutPage } from '../pages/CheckoutPage'
import { CheckoutLocators } from '../locators/checkout.locators';
import { first_name, last_name, postal_code } from '../test-data/test.config';

require('dotenv').config();

const validUsername = process.env.SAUCE_USERNAME || '';
const validPassword = process.env.SAUCE_PASSWORD || '';
const invalidUsername = process.env.SAUCE_INVALID_USERNAME || '';
const invalidPassword = process.env.SAUCE_INVALID_PASSWORD || '';

// Test Case 1: Valid Login

test('User can log in with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(BASE_URL);
  await loginPage.login(validUsername, validPassword);
  await expect(page).toHaveURL(/inventory/);
});

// Test Case 2: Invalid Login

test('User sees error message with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(BASE_URL);
  await loginPage.login(invalidUsername, invalidPassword);
  await expect(loginPage.errorMessage).toBeVisible();
});

// Test Case 3: Add and remove items from inventory page

test('User can add and remove item from inventory and validate cart count', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await page.goto(BASE_URL);
  await loginPage.login(validUsername, validPassword);

  await inventoryPage.addItemToCartByName('sauce-labs-backpack');
  await expect(await inventoryPage.getCartItemCount()).toBe(1);

  await inventoryPage.removeItemFromCartByName('sauce-labs-backpack');
  await expect(await inventoryPage.getCartItemCount()).toBe(0);
});

// Test Case 4: User sees correct item in cart page after adding from inventory

test('User sees correct item in cart page after adding from inventory', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await page.goto(BASE_URL);
  await loginPage.login(validUsername, validPassword);

  await inventoryPage.addItemToCartByName('sauce-labs-backpack');
  await inventoryPage.goToCart();

  await expect(await cartPage.isItemInCart('Sauce Labs Backpack')).toBeTruthy();
  await expect(await cartPage.getCartItemsCount()).toBe(1);
});

// Test Case 5: Add items between $10 and $15 and verify in cart


test('User adds up to 3 items priced between $10 and $15 and verifies them in the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await page.goto(BASE_URL);
  await loginPage.login(validUsername, validPassword);

  const itemNames: string[] = [];
  const inventoryItems = page.locator(InventoryLocators.inventoryItem);
  const count = await inventoryItems.count();

  for (let i = 0; i < count; i++) {
    const item = inventoryItems.nth(i);
    const priceText = await item.locator(InventoryLocators.itemPrice).innerText();
    const name = await item.locator(InventoryLocators.itemName).innerText();
    const price = parseFloat(priceText.replace('$', ''));

    if (price >= 10 && price <= 15) {
      const formattedName = name.toLowerCase().replace(/ /g, '-');
      await page.locator(InventoryLocators.addToCartButton(formattedName)).click();
      itemNames.push(name);
    }

    if (itemNames.length === 3) break;
  }

  await inventoryPage.goToCart();

  for (const name of itemNames) {
    await expect(await cartPage.isItemInCart(name)).toBeTruthy();
  }

  await expect(await cartPage.getCartItemsCount()).toBe(itemNames.length);
});


// Test Case 6: Smart combo under $30 - pick 2 most expensive items ≤ $30

test('User adds the optimal pair of products under $30 and verifies them in the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await page.goto(BASE_URL);
  await loginPage.login(validUsername, validPassword);

  const inventoryItems = page.locator(InventoryLocators.inventoryItem);
  const count = await inventoryItems.count();

  const products: { name: string; price: number }[] = [];

  for (let i = 0; i < count; i++) {
    const item = inventoryItems.nth(i);
    const priceText = await item.locator(InventoryLocators.itemPrice).innerText();
    const name = await item.locator(InventoryLocators.itemName).innerText();
    const price = parseFloat(priceText.replace('$', ''));
    products.push({ name, price });
  }

  let bestPair: [string, string] | null = null;
  let bestTotal = 0;

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const total = products[i].price + products[j].price;
      if (total <= 30 && total > bestTotal) {
        bestPair = [products[i].name, products[j].name];
        bestTotal = total;
      }
    }
  }

  if (bestPair) {
    for (const name of bestPair) {
      const formatted = name.toLowerCase().replace(/ /g, '-');
      await page.locator(InventoryLocators.addToCartButton(formatted)).click();
    }
    await inventoryPage.goToCart();
    for (const name of bestPair) {
      await expect(await cartPage.isItemInCart(name)).toBeTruthy();
    }
    await expect(await cartPage.getCartItemsCount()).toBe(2);
  } else {
    console.log('No valid product pair found under $30');
  }
});


// Test Case 7: Complete checkout after smart combo selection

test('User completes checkout after selecting items under $30', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  

  await page.goto(BASE_URL);
  await loginPage.login(validUsername, validPassword);

  const inventoryItems = page.locator(InventoryLocators.inventoryItem);
  const count = await inventoryItems.count();
  const products: { name: string; price: number }[] = [];

  for (let i = 0; i < count; i++) {
    const item = inventoryItems.nth(i);
    const priceText = await item.locator(InventoryLocators.itemPrice).innerText();
    const name = await item.locator(InventoryLocators.itemName).innerText();
    const price = parseFloat(priceText.replace('$', ''));
    products.push({ name, price });
  }

  let bestPair: [string, string] | null = null;
  let bestTotal = 0;

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const total = products[i].price + products[j].price;
      if (total <= 30 && total > bestTotal) {
        bestPair = [products[i].name, products[j].name];
        bestTotal = total;
      }
    }
  }

  if (bestPair) {
    for (const name of bestPair) {
      const formatted = name.toLowerCase().replace(/ /g, '-');
      await page.locator(InventoryLocators.addToCartButton(formatted)).click();
    }

    await inventoryPage.goToCart();
    for (const name of bestPair) {
      await expect(await cartPage.isItemInCart(name)).toBeTruthy();
    }

    await cartPage.proceedToCheckout();

    await page.locator(CheckoutLocators.firstNameInput).fill(first_name);
    await page.locator(CheckoutLocators.lastNameInput).fill(last_name);
    await page.locator(CheckoutLocators.postalCodeInput).fill(postal_code);
    await page.locator(CheckoutLocators.continueButton).click();
    
    await page.locator(CheckoutLocators.finishButton).click();
    await expect(page.locator(CheckoutLocators.confirmationHeader)).toHaveText('Thank you for your order!');
  } else {
    console.log('No valid product pair found under $30');
  }
});

// Test Case 8: Mobile responsiveness — viewport iPhone 12
test('App layout renders correctly on mobile viewport (iPhone 12)', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(BASE_URL);

  const loginPage = new LoginPage(page);
  await loginPage.login(validUsername, validPassword);

  await expect(page.locator('.inventory_list')).toBeVisible();
  await expect(page.locator('.app_logo')).toBeVisible();

  await context.close();
});


// Test Case 9: Accessibility compliance check on login page
test('Login page should meet basic accessibility standards', async ({ page }) => {
  await page.goto(BASE_URL);

  // Check for missing alt text, label associations, and ARIA roles
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  const inputsWithoutLabel = await page.locator('input:not([aria-label]):not([aria-labelledby])').count();
  const missingRoles = await page.locator('[role]').count();

  expect(imagesWithoutAlt).toBe(0);
  expect(inputsWithoutLabel).toBe(0);
  expect(missingRoles).toBeGreaterThan(0); // Ensure ARIA roles exist somewhere
});

// Test Case 10: API test - POST /api/users
test('POST /api/users - Create user successfully', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/users', {
    data: {
      name: 'Sadiqul Alam',
      job: 'QA Lead'
    }
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body).toHaveProperty('name', 'Sadiqul Alam');
  expect(body).toHaveProperty('job', 'QA Lead');
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('createdAt');
});