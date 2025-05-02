import { Page, Locator } from '@playwright/test';
import { CartLocators } from '../locators/cart.locators';

export class CartPage {
  private page: Page;
  private cartItems: Locator;
  private checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator(CartLocators.cartItem);
    this.checkoutButton = page.locator(CartLocators.checkoutButton);
  }

  async getCartItemsCount(): Promise<number> {
    return this.cartItems.count();
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    return this.page.locator(CartLocators.itemName, { hasText: itemName }).isVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}