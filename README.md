# 🚀 Playwright Demo Project Setup & Execution Guide

This project includes end-to-end UI and API tests built with **Playwright + TypeScript**, using Page Object Model (POM), config-based test data, and clean locator abstraction.

---

## 📁 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/saSaimon/playwright-demo.git
cd playwright-demo
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Set up `.env` file(if .env file is not found in repo/project)

Create a `.env` file in the root directory:

```env
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
SAUCE_INVALID_USERNAME=wrong_user
SAUCE_INVALID_PASSWORD=wrong_pass
```

---

### 4. Update optional static test data

Edit `test-data/test.config.ts`:

```ts
export const BASE_URL = 'https://www.saucedemo.com';
export const first_name = 'Sadiqul';
export const last_name = 'Alam';
export const postal_code = '12345';
export const job_title = 'QA Lead';
```

---

## ▶️ Running Tests

### ✅ Run all tests

```bash
npx playwright test
```

---

### 🎯 Run the `e2e-flow.spec.ts` only

```bash
npx playwright test tests/e2e-flow.spec.ts
```

or using a pattern:

```bash
npx playwright test e2e-flow
```

---

### 🧪 Run a single test inside the file

```bash
npx playwright test -g "User completes checkout after selecting items under $30"
```

---

### 🪟 Run with browser UI (headed mode)

```bash
npx playwright test tests/e2e-flow.spec.ts --headed
```

---

### 🧵 Run with debug mode (step-by-step)

```bash
npx playwright test tests/e2e-flow.spec.ts --debug
```

---

### 📊 View the last test report

```bash
npx playwright show-report
```

---

## ✅ Test Structure Highlights

- `tests/e2e-flow.spec.ts` — contains 10 full-flow and API test cases
- `pages/` — all Page Object classes like `LoginPage`, `CheckoutPage`
- `locators/` — element selectors abstracted per feature
- `test-data/` — test config and static values (names, zip, job title)

---

## 💬 Need Help?

If `first_name`, `BASE_URL`, or any variable shows `undefined`, ensure:
- The `test-data/test.config.ts` file is correctly imported
- You have no typos in import names

---

You're now ready to run your suite with confidence! 🚀
