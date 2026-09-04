import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Loading from '../../components/Loading';
import {
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import AuthService from '../../services/AuthService';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { totalItemsCount, cartSubtotal } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await AuthService.getOrders(user.id)
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [user]);

  const activeOrders = orders.filter((o) => o.status === 'PLACED' || o.status === 'PROCESSING');

  return (
    <div id="customer-dashboard-page" className="space-y-8 pb-16">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Overview</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            Welcome back, {user?.name || 'Customer'} • Track orders and manage your shopping
          </p>
        </div>
        <Link
          id="customer-browse-btn"
          to="/products"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors text-sm shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Catalog</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Cart Items</p>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalItemsCount}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">(${cartSubtotal.toFixed(2)})</span>
            </div>
            <Link to="/customer/cart" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              View Cart →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Active Orders</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{activeOrders.length.toString().padStart(2, '0')}</span>
            <Link to="/customer/orders" className="text-xs text-amber-600 dark:text-amber-400 font-medium hover:underline">
              Track Packages →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Total Orders Placed</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{orders.length.toString().padStart(2, '0')}</span>
            <Link to="/customer/orders" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Order History →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Recent Orders</span>
            <span className="px-2 py-0.5 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded text-[10px] font-bold">
              {orders.length} TOTAL
            </span>
          </h2>
          <Link
            to="/customer/orders"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loading message="Loading recent orders..." />
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-8 text-center space-y-3 transition-colors duration-200">
            <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">No orders placed yet</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">Browse the catalogue to find products from independent businesses.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Order #{order.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 dark:bg-emerald-950/80 text-green-700 dark:text-emerald-300 uppercase">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Placed on {order.orderDate} • {order.products?.length || 0} product(s) • Payment: {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/products"
          className="bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500 border border-gray-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200 flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Browse Catalog</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Explore products recently added by our businesses.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </Link>

        <Link
          to="/customer/cart"
          className="bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500 border border-gray-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200 flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Cart & Checkout</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Review your selections and complete your purchase.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-700 dark:text-slate-300" />
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
