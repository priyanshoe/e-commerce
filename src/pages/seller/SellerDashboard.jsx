import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import {
  Plus,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch all businesses owned by this seller
        const bizRes = await api.get('/businesses', {
          params: { sellerId: user.id },
        });
        const myBusinesses = bizRes.data;
        setBusinesses(myBusinesses);

        // Fetch all products and orders
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
        ]);

        const allProducts = productsRes.data;
        const myBizIds = new Set(myBusinesses.map((b) => Number(b.id)));

        // Filter products belonging to any of seller's businesses
        const sellerProducts = allProducts.filter((p) => myBizIds.has(Number(p.businessId)));
        setProducts(sellerProducts);

        // Filter orders containing products from seller's businesses
        const sellerOrders = ordersRes.data.filter((ord) =>
          ord.products?.some((p) => myBizIds.has(Number(p.businessId)))
        );
        setOrders(sellerOrders);
      } catch (err) {
        console.error('Failed to load seller dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user]);

  if (loading) {
    return <Loading fullScreen message="Loading seller portal..." />;
  }

  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'PLACED' || o.status === 'PROCESSING');
  
  // Calculate simulated revenue from seller's products
  const totalRevenue = orders.reduce((sum, ord) => {
    const bizIds = new Set(businesses.map((b) => Number(b.id)));
    const sellerItems = ord.products?.filter((p) => bizIds.has(Number(p.businessId))) || [];
    const itemSum = sellerItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity || 1)), 0);
    return sum + itemSum;
  }, 0);

  const cardStripeColors = [
    'bg-indigo-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-sky-500',
    'bg-purple-500',
  ];

  return (
    <div id="seller-dashboard-page" className="space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Overview of your commerce ecosystem</p>
        </div>
        <Link
          id="seller-create-business-btn"
          to="/seller/businesses/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-xs transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Business</span>
        </Link>
      </div>

      {/* Warning banner if no business registered */}
      {businesses.length === 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Please register your business before adding products.</p>
            <p className="text-amber-700 dark:text-amber-300 mt-0.5">
              Each product in the system belongs to a registered business. Start by setting up your first business!
            </p>
            <Link
              to="/seller/businesses/create"
              className="inline-block mt-2 font-bold text-indigo-700 dark:text-indigo-400 hover:underline"
            >
              Register Business Now →
            </Link>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Total Businesses</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{businesses.length.toString().padStart(2, '0')}</span>
            <Link to="/seller/businesses" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Total Products</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{products.length.toString().padStart(2, '0')}</span>
            <span className="text-xs text-green-600 dark:text-emerald-400 font-medium">{totalStock} In Stock</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Pending Orders</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{pendingOrders.length.toString().padStart(2, '0')}</span>
            <Link to="/seller/orders" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Review now
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Total Revenue</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(0)}</span>
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Simulated</span>
          </div>
        </div>
      </div>

      {/* Active Businesses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Active Businesses</span>
            <span className="px-2 py-0.5 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded text-[10px] font-bold">
              {businesses.length} TOTAL
            </span>
          </h2>
          <Link
            to="/seller/businesses"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz, idx) => {
            const bizProducts = products.filter((p) => String(p.businessId) === String(biz.id));
            const stripeColor = cardStripeColors[idx % cardStripeColors.length];

            return (
              <div
                key={biz.id}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200 flex flex-col justify-between shadow-xs"
              >
                <div className={`h-2 w-full ${stripeColor}`} />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{biz.name}</h3>
                      <span className="bg-green-100 dark:bg-emerald-950/80 text-green-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {biz.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 line-clamp-2">{biz.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 dark:text-slate-500">
                    <div>
                      <span className="font-bold text-gray-700 dark:text-slate-300">{bizProducts.length}</span> Products
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/seller/businesses/${biz.id}`}
                        className="text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        Info
                      </Link>
                      <Link
                        to={`/seller/businesses/${biz.id}/products`}
                        className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        Manage &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Venture Card */}
          <Link
            to="/seller/businesses/create"
            className="bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center p-8 group hover:bg-white dark:hover:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all min-h-[200px]"
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm">New Venture</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Register another business</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
