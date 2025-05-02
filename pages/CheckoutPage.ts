import { expect } from '@playwright/test';
import { Page, Locator } from '@playwright/test';
import { CheckoutLocators } from '../locators/checkout.locators';

export class CheckoutPage {
  private page: Page;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private postalCodeInput: Locator;
  private continueButton: Locator;
  private finishButton: Locator;
  private confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator(CheckoutLocators.firstNameInput);
    this.lastNameInput = page.locator(CheckoutLocators.lastNameInput);
    this.postalCodeInput = page.locator(CheckoutLocators.postalCodeInput);
    this.continueButton = page.locator(CheckoutLocators.continueButton);
    this.finishButton = page.locator(CheckoutLocators.finishButton);
    this.confirmationHeader = page.locator(CheckoutLocators.confirmationHeader);
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToSummary(): Promise<void> {
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async verifyOrderCompletion(): Promise<void> {
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
  }
}