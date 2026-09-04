import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Truck,
  AlertCircle,
} from 'lucide-react';
import OrderService from '../../services/OrderService';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await OrderService.getOrder(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <Loading fullScreen message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
        <p className="text-xs text-gray-500 dark:text-slate-400">{error || 'Unable to retrieve order details.'}</p>
        <Link
          to="/customer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div id="order-details-page" className="max-w-4xl mx-auto space-y-8 pb-16">

      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <Link
          id="back-to-orders-btn"
          to="/customer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>

        <span
          className={`text-xs font-bold px-3 py-1 rounded uppercase tracking-wider ${order.status === 'PLACED'
            ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300'
            : order.status === 'PROCESSING'
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
            }`}
        >
          Status: {order.status}
        </span>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors duration-200">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.id}</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Placed on {order.orderDate}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 dark:text-slate-500 block font-medium">Total Paid</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Purchased Products
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-lg p-2 bg-gray-50/50 dark:bg-slate-800/40">
            {order.products?.map((item, index) => (
              <div key={index} className="p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-slate-700 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-slate-100">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

          {/* Shipping Address */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-slate-200">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Delivery Address</span>
            </div>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{order.shippingAddress}</p>
          </div>

          {/* Payment Method */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-slate-200">
              <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Payment Details</span>
            </div>
            <p className="text-gray-600 dark:text-slate-400">
              Method: <strong>{order.paymentMethod}</strong>
            </p>
            {order.cardLast4 && (
              <p className="text-gray-500 dark:text-slate-400">Card ending in •••• {order.cardLast4}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
