import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Loading from '../../components/Loading';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, cartSubtotal, totalItemsCount } =
    useCart();
  const navigate = useNavigate();

  if (loading) {
    return <Loading fullScreen message="Loading your cart..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div id="empty-cart-view" className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
          Browse the catalogue to add items to your cart.
        </p>
        <div className="pt-2">
          <Link
            id="browse-products-from-empty-cart"
            to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page" className="max-w-5xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            You have {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemTotal = (item.product?.price || 0) * item.quantity;

            return (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-200"
              >
                {/* Product Info & Thumbnail */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-gray-100 dark:border-slate-700">
                    <img
                      src={
                        item.product?.image ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-semibold text-sm sm:text-base text-gray-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                    >
                      {item.product?.name || 'Unknown Product'}
                    </Link>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                      ${Number(item.product?.price || 0).toFixed(2)} each
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                      {item.product?.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Controls & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 p-1">
                    <button
                      id={`decrease-qty-${item.id}`}
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded disabled:opacity-30 transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-gray-800 dark:text-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      id={`increase-qty-${item.id}`}
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.product?.stock || 99)}
                      className="p-1 text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded disabled:opacity-30 transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-xs text-gray-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Total</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    id={`remove-cart-item-${item.id}`}
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors duration-200">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-slate-800 pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-gray-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal ({totalItemsCount})</span>
                <span className="font-semibold text-gray-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-sm text-gray-900 dark:text-white">Cart Total</span>
                <span className="font-extrabold text-xl text-gray-900 dark:text-white">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/customer/checkout')}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Your order details are securely processed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
