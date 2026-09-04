import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import Loading from '../../components/Loading';
import {
  Users,
  Store,
  Layers,
  Package,
  ArrowRight,
} from 'lucide-react';
import AuthService from '../../services/AuthService';
import BusinesseService from '../../services/BusinesseService';
import ProductService from '../../services/ProductService';
import OrderService from '../../services/OrderService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const [usersRes, bizRes, prodRes, ordRes] = await Promise.all([
          AuthService.findAll(),
          BusinesseService.getBusinesses(),
          ProductService.getProducts(),
          OrderService.getOrders(),
        ]);

        setUsers(usersRes.data);
        setBusinesses(bizRes.data);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <Loading fullScreen message="Loading administrative dashboard..." />;
  }

  const customers = users.filter((u) => u.role === 'CUSTOMER');
  const sellers = users.filter((u) => u.role === 'SELLER');
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div id="admin-dashboard-page" className="space-y-8 pb-16">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            Global system analytics and administrative management controls
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 self-start sm:self-auto">
          <div className="w-2 h-2 bg-rose-500 rounded-full" />
          <span className="text-[11px] font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
            Superuser Mode
          </span>
        </div>
      </div>

      {/* 5 Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

        {/* Total Customers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Customers</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{customers.length.toString().padStart(2, '0')}</span>
            <Link to="/admin/users" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              View →
            </Link>
          </div>
        </div>

        {/* Total Sellers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Sellers</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{sellers.length.toString().padStart(2, '0')}</span>
            <Link to="/admin/users" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              View →
            </Link>
          </div>
        </div>

        {/* Total Businesses */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Businesses</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{businesses.length.toString().padStart(2, '0')}</span>
            <Link to="/admin/businesses" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Stores →
            </Link>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Products</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{products.length.toString().padStart(2, '0')}</span>
            <Link to="/admin/products" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Items →
            </Link>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1 transition-colors duration-200">
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Orders</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{orders.length.toString().padStart(2, '0')}</span>
            <Link to="/admin/orders" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Orders →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="group bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500 border border-gray-200 dark:border-slate-800 p-5 rounded-xl transition-colors duration-200 shadow-xs flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Manage Users</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Inspect Customers, Sellers, and Admins</p>
          </div>
        </Link>

        <Link
          to="/admin/businesses"
          className="group bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500 border border-gray-200 dark:border-slate-800 p-5 rounded-xl transition-colors duration-200 shadow-xs flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Manage Businesses</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">All registered storefronts & statuses</p>
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="group bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500 border border-gray-200 dark:border-slate-800 p-5 rounded-xl transition-colors duration-200 shadow-xs flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Manage Products</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Global catalog & inventory levels</p>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="group bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500 border border-gray-200 dark:border-slate-800 p-5 rounded-xl transition-colors duration-200 shadow-xs flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Manage Orders</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Total GMV: ${totalRevenue.toFixed(2)}</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Platform Transactions</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Live order activity across all customer sessions</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-medium">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">#{order.id}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">User #{order.customerId}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{order.orderDate}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{order.paymentMethod}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-emerald-950/80 text-green-700 dark:text-emerald-300 uppercase">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
