export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

const CART_STORAGE_KEY = 'deja-burg-cart';
const CART_UPDATE_EVENT = 'cart-updated';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT, { detail: cart }));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

export function addToCart(name: string, price: number): void {
  const cart = getCart();
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  
  saveCart(cart);
}

export function removeFromCart(name: string): void {
  const cart = getCart();
  const filteredCart = cart.filter(item => item.name !== name);
  saveCart(filteredCart);
}

export function updateQuantity(name: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(name);
    return;
  }
  
  const cart = getCart();
  const item = cart.find(item => item.name === name);
  
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function formatCartForWhatsApp(): string {
  const cart = getCart();
  
  if (cart.length === 0) {
    return 'Hola! Me gustaría hacer un pedido 🍔';
  }
  
  const items = cart.map(item => 
    `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString('es-CO')}`
  ).join('\n');
  
  const total = getCartTotal();
  
  return `Hola! Me gustaría hacer el siguiente pedido:\n\n${items}\n\n*Total: $${total.toLocaleString('es-CO')}*\n\n¡Gracias! 🍔`;
}

export function onCartUpdate(callback: (cart: CartItem[]) => void): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<CartItem[]>;
    callback(customEvent.detail);
  };
  
  window.addEventListener(CART_UPDATE_EVENT, handler);
  
  return () => window.removeEventListener(CART_UPDATE_EVENT, handler);
}
