import { useState, useEffect, useMemo } from 'react';
import Loading from '../../components/Loading';
import { Package, Search, CreditCard, Truck } from 'lucide-react';
import OrderService from '../../services/OrderService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderService.getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await OrderService.update(orderId, newStatus);
      // Update only the changed order; re-fetching here remounted the page loader.
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, ...res.data } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== 'ALL') {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          String(o.id).includes(q) ||
          String(o.customerId).includes(q) ||
          o.shippingAddress?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [orders, statusFilter, searchTerm]);

  if (loading) {
    return <Loading fullScreen message="Loading all orders..." />;
  }

  return (
    <div id="admin-orders-page" className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            All System Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit and manage order statuses across all customer purchases.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === st
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {st} ({st === 'ALL' ? orders.length : orders.filter((o) => o.status === st).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            id={`admin-order-${order.id}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-slate-400 text-[11px] block">Order ID</span>
                  <span className="font-bold text-slate-900">#{order.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Date</span>
                  <span className="font-medium text-slate-700">{order.orderDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Customer</span>
                  <span className="font-semibold text-slate-800">User ID #{order.customerId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Total Amount</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px]">Status:</span>
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

            {/* Items */}
            <div className="p-6 divide-y divide-slate-100">
              {order.products?.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity} • ${Number(item.price).toFixed(2)} each • Business ID: {item.businessId}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Address */}
            <div className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Payment: {order.paymentMethod}</span>
              </span>
              <span className="truncate max-w-sm">📍 Delivery: {order.shippingAddress}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
