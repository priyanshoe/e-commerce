import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import {
  CreditCard,
  Truck,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartSubtotal, totalItemsCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping details state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    phone: '+1 (555) 019-2834',
  });

  // Payment method state ('CARD' or 'COD')
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  // Mock Card fields
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name || 'JOHN CUSTOMER',
    expiry: '12/28',
    cvv: '888',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 dark:text-slate-400">Please add products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city) {
      setError('Please provide complete delivery details.');
      return;
    }

    if (paymentMethod === 'CARD') {
      if (!cardInfo.cardNumber || !cardInfo.cardHolder || !cardInfo.expiry || !cardInfo.cvv) {
        setError('Please complete the mock card payment details.');
        return;
      }
    }

    try {
      setLoading(true);

      // Construct order products snapshot
      const orderProducts = cartItems.map((item) => ({
        productId: item.productId,
        name: item.product?.name || 'Product',
        businessId: item.product?.businessId || null,
        price: item.product?.price || 0,
        quantity: item.quantity,
        image: item.product?.image || '',
      }));

      const fullAddress = `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postalCode}, Tel: ${shippingInfo.phone}`;

      // Create order via REST API POST /orders
      const orderResponse = await api.post('/orders', {
        customerId: user.id,
        products: orderProducts,
        totalAmount: cartSubtotal,
        paymentMethod: paymentMethod === 'CARD' ? 'Card Payment' : 'Cash on Delivery',
        status: 'PLACED',
        orderDate: new Date().toISOString().split('T')[0],
        shippingAddress: fullAddress,
        cardLast4: paymentMethod === 'CARD' ? '4242' : null,
      });

      // Clear customer's cart
      await clearCart();

      // Navigate to order confirmation / details
      const createdOrder = orderResponse.data;
      navigate(`/customer/orders/${createdOrder.id}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="checkout-page" className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Checkout</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Finalize your delivery and payment preferences</p>
        </div>
        <Link
          to="/customer/cart"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>1. Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">Postal / Zip Code</label>
                <input
                  type="text"
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>2. Payment Method</span>
            </div>

            {/* Payment Choice Radio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'CARD'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/50'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50/50 dark:bg-slate-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block font-bold text-xs text-gray-900 dark:text-white">Card Payment</span>
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">Simulate instant online card checkout</span>
                </div>
              </label>

              <label
                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/50'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50/50 dark:bg-slate-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block font-bold text-xs text-gray-900 dark:text-white">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">Pay cash upon parcel delivery</span>
                </div>
              </label>
            </div>

            {/* Mock Card Form if Card selected */}
            {paymentMethod === 'CARD' ? (
              <div className="bg-gray-50 dark:bg-slate-800/80 p-4 rounded-lg border border-gray-200 dark:border-slate-700 space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                    Simulated Card Interface
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded font-semibold">
                    Mock Only • No Real Charges
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 dark:text-slate-300 mb-1 font-medium">Card Number</label>
                    <input
                      type="text"
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                      placeholder="4242 4242 4242 4242"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 dark:text-slate-300 mb-1 font-medium">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardInfo.cardHolder}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardHolder: e.target.value })}
                      placeholder="JOHN DOE"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg uppercase text-gray-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-slate-300 mb-1 font-medium">Expiry Date</label>
                    <input
                      type="text"
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      placeholder="MM/YY"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-slate-300 mb-1 font-medium">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      placeholder="123"
                      maxLength={4}
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 rounded-lg text-emerald-900 dark:text-emerald-200 text-xs">
                <p className="font-semibold mb-0.5">Cash on Delivery Selected</p>
                <p className="text-emerald-700 dark:text-emerald-300">
                  You will pay the exact total of <strong>${cartSubtotal.toFixed(2)}</strong> in cash when the delivery courier arrives.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Items & Total */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
            <h2 className="font-bold text-gray-900 dark:text-white text-base border-b border-gray-100 dark:border-slate-800 pb-3">
              Order Items ({totalItemsCount})
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product?.image || ''}
                      alt={item.product?.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-slate-100 truncate">{item.product?.name}</p>
                      <p className="text-gray-400 dark:text-slate-500 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white shrink-0">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2 text-xs text-gray-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-sm text-gray-900 dark:text-white">Total</span>
                <span className="font-extrabold text-xl text-gray-900 dark:text-white">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Place Order (${cartSubtotal.toFixed(2)})</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
