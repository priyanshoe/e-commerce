import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import {
  Package,
  Calendar,
  CreditCard,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import OrderService from '../../services/OrderService';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, ACTIVE, PAST

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await OrderService.getOrderByUser(user.id);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const activeOrders = orders.filter(
    (o) => o.status === 'PLACED' || o.status === 'PROCESSING' || o.status === 'SHIPPED'
  );
  const pastOrders = orders.filter(
    (o) => o.status === 'DELIVERED' || o.status === 'CANCELLED' || o.status === 'COMPLETED'
  );

  const displayedOrders =
    filterTab === 'ACTIVE'
      ? activeOrders
      : filterTab === 'PAST'
        ? pastOrders
        : orders;

  if (loading) {
    return <Loading fullScreen message="Loading your orders..." />;
  }

  return (
    <div id="customer-orders-page" className="max-w-5xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Orders</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Review your purchases and follow each order’s progress.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-xs transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop More Items</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filterTab === 'ALL'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilterTab('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filterTab === 'ACTIVE'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
        >
          Current / Active ({activeOrders.length})
        </button>
        <button
          onClick={() => setFilterTab('PAST')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filterTab === 'PAST'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
        >
          Past Orders ({pastOrders.length})
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-12 text-center space-y-3 transition-colors duration-200">
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">No orders yet</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
            {filterTab === 'ACTIVE'
              ? 'You have no current active orders in progress.'
              : 'No order history available.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => (
            <div
              key={order.id}
              id={`order-card-${order.id}`}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200"
            >
              {/* Order Header Bar */}
              <div className="bg-gray-50/80 dark:bg-slate-800/60 px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-400 dark:text-slate-500 text-[11px] block">Order Placed</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                      {order.orderDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-slate-500 text-[11px] block">Order ID</span>
                    <span className="font-bold text-gray-900 dark:text-white">#{order.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-slate-500 text-[11px] block">Total Amount</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${order.status === 'PLACED'
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300'
                      : order.status === 'PROCESSING'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      }`}
                  >
                    {order.status}
                  </span>

                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="flex items-center gap-1 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>

              {/* Products in this order */}
              <div className="p-5 divide-y divide-gray-100 dark:divide-slate-800">
                {order.products?.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-100 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-slate-100">{item.name}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">
                          Qty: {item.quantity} • ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer delivery status */}
              <div className="px-5 py-2.5 bg-gray-50/50 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span>Payment: {order.paymentMethod}</span>
                </span>
                <span className="truncate max-w-xs">📍 {order.shippingAddress}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
