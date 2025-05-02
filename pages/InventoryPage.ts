import { Page, Locator } from '@playwright/test';
import { InventoryLocators } from '../locators/inventory.locators';

export class InventoryPage {
  private page: Page;
  private cartBadge: Locator;
  private cartIcon: Locator;
  private menuButton: Locator;
  private logoutLink: Locator;
  private resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator(InventoryLocators.cartBadge);
    this.cartIcon = page.locator(InventoryLocators.cartIcon);
    this.menuButton = page.locator(InventoryLocators.menuButton);
    this.logoutLink = page.locator(InventoryLocators.logoutLink);
    this.resetAppStateLink = page.locator(InventoryLocators.resetAppStateLink);
  }

  async addItemToCartByName(itemName: string): Promise<void> {
    const selector = InventoryLocators.addToCartButton(itemName);
    await this.page.locator(selector).click();
  }

  async removeItemFromCartByName(itemName: string): Promise<void> {
    const selector = InventoryLocators.removeFromCartButton(itemName);
    await this.page.locator(selector).click();
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.menuButton.click();
    await this.resetAppStateLink.click();
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const countText = await this.cartBadge.innerText();
    return parseInt(countText, 10);
  }
}
