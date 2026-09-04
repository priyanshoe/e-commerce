import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import CartService from '../services/CartService';
import ProductService from '../services/ProductService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart items for current customer
  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'CUSTOMER') {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      // Get all cart items for this customer
      const cartRes = await CartService.getCartByUser(user.id)

      // Also get all products to combine rich product info
      const productsRes = await ProductService.getProducts();
      const products = productsRes.data;

      const itemsWithProduct = cartRes.data.map((item) => {
        const product = products.find((p) => String(p.id) === String(item.productId)) || null;
        return {
          ...item,
          product,
        };
      }).filter(item => item.product !== null); // Ignore orphan products if any

      setCartItems(itemsWithProduct);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, requireLogin: true };
    if (user.role !== 'CUSTOMER') {
      return { success: false, message: 'Only customers can add items to the cart.' };
    }

    try {
      const existing = cartItems.find((item) => String(item.productId) === String(productId));

      if (existing) {
        // Update quantity
        const newQty = existing.quantity + quantity;
        await CartService.update(existing.id, newQty);
      } else {
        // Create new cart item
        const data = {
          customerId: user.id,
          productId: productId,
          quantity: quantity
        }
        await CartService.save(data)
      }

      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, message: 'Failed to add item to cart.' };
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await CartService.update(cartItemId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await CartService.deleteItem(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // Clear customer cart (after order placement)
  const clearCart = async () => {
    try {
      for (const item of cartItems) {
        await CartService.deleteItem(item.id);
      }
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  // Calculate totals
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.product ? item.product.price * item.quantity : 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        totalItemsCount,
        cartSubtotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
