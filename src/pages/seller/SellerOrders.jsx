import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  Store,
  CheckCircle2,
  Clock,
  ChevronDown,
} from 'lucide-react';
import BusinesseService from '../../services/BusinesseService';
import OrderService from '../../services/OrderService';

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSellerOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [bizRes, ordersRes] = await Promise.all([
        BusinesseService.getBusinessesByUser(user.id),
        OrderService.getOrders()
      ]);

      const myBizList = bizRes.data;
      setBusinesses(myBizList);

      const myBizIds = new Set(myBizList.map((b) => Number(b.id)));

      // Filter only orders that contain products belonging to this seller's businesses
      const matchedOrders = ordersRes.data
        .map((order) => {
          const sellerProductsInOrder = (order.products || []).filter((p) =>
            myBizIds.has(Number(p.businessId))
          );
          if (sellerProductsInOrder.length === 0) return null;

          const sellerTotal = sellerProductsInOrder.reduce(
            (sum, p) => sum + (Number(p.price) || 0) * (p.quantity || 1),
            0
          );

          return {
            ...order,
            sellerProducts: sellerProductsInOrder,
            sellerSubtotal: sellerTotal,
          };
        })
        .filter(Boolean);

      setOrders(matchedOrders);
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      // REST API PATCH /orders/:id
      await OrderService.update(orderId, newStatus)
      await fetchSellerOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading seller orders..." />;
  }

  return (
    <div id="seller-orders-page" className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Seller Orders & Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View customer orders placed for products across all your registered businesses.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Orders Received Yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When customers place orders containing items from your storefronts, they will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              id={`seller-order-${order.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Order Meta Header */}
              <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Order ID</span>
                    <span className="font-bold text-slate-900">#{order.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Order Date</span>
                    <span className="font-semibold text-slate-800">{order.orderDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Customer ID</span>
                    <span className="font-medium text-slate-700">User #{order.customerId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Your Earnings</span>
                    <span className="font-extrabold text-indigo-600 text-sm">
                      ${order.sellerSubtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Status selector (REST PATCH) */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-[11px]">Update Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="bg-white border border-slate-200 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 divide-y divide-slate-100">
                {order.sellerProducts.map((item, idx) => {
                  const biz = businesses.find((b) => Number(b.id) === Number(item.businessId));
                  return (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            item.image ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            Store: <span className="font-semibold text-indigo-600">{biz?.name || 'Your Business'}</span> • Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-sm text-slate-900">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Payment: {order.paymentMethod}</span>
                </span>
                <span className="truncate max-w-sm">📍 Delivery: {order.shippingAddress}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
