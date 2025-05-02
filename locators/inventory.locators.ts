
export const InventoryLocators = {
    inventoryItem: '.inventory_item',
    itemName: '.inventory_item_name',
    itemDescription: '.inventory_item_desc',
    itemPrice: '.inventory_item_price',
    addToCartButton: (itemName: string) => `button[data-test="add-to-cart-${itemName}"]`,
    removeFromCartButton: (itemName: string) => `button[data-test="remove-${itemName}"]`,
    cartBadge: '.shopping_cart_badge',
    cartIcon: '.shopping_cart_link',
    menuButton: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
    resetAppStateLink: '#reset_sidebar_link'
  };