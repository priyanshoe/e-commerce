import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { ArrowRight, ShieldCheck, Truck, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductService from '../services/ProductService';
import BusinesseService from '../services/BusinesseService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [productsRes, businessesRes] = await Promise.all([
          ProductService.getProducts(),
          BusinesseService.getBusinesses(),
        ]);



        setFeaturedProducts(productsRes.data.slice(0, 6));
        setBusinesses(businessesRes.data);
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div id="home-page" className="space-y-10 pb-16">

      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-gray-600 dark:text-slate-300">
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            <span>Modern commerce, made simple</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Your marketplace, thoughtfully managed
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
            Discover quality products from independent businesses and manage every part of your marketplace in one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            id="hero-explore-btn"
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors text-sm"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {!isAuthenticated() ? (
            <Link
              id="hero-register-btn"
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-semibold transition-colors text-sm"
            >
              <span>Create Account</span>
            </Link>
          ) : (
            <Link
              id="hero-dashboard-btn"
              to={
                user?.role === 'SELLER'
                  ? '/seller/dashboard'
                  : user?.role === 'ADMIN'
                    ? '/admin/dashboard'
                    : '/customer/dashboard'
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-semibold transition-colors text-sm"
            >
              <span>{user?.role} Portal &rarr;</span>
            </Link>
          )}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Inventory You Can Trust</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
              See current availability and keep your selections organised as you shop.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Built for Growing Businesses</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
              Build storefronts, publish products, and fulfil orders from one focused workspace.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Purpose-Built Workspaces</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
              Tailored experiences give customers, sellers, and administrators the tools they need.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Catalog Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Explore a curated selection from trusted independent businesses.</p>
          </div>
          <Link
            id="view-all-products-link"
            to="/products"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loading message="Loading featured products..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const business = businesses.find((b) => String(b.id) === String(product.businessId));
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  businessName={business?.name}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Active Businesses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Featured Stores</span>
            <span className="px-2 py-0.5 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded text-[10px] font-bold">
              {businesses.length} VERIFIED
            </span>
          </h2>
          <Link
            to="/products"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            Browse Stores &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex items-start justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">{business.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 dark:bg-emerald-950/80 text-green-700 dark:text-emerald-300 uppercase">
                    {business.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400">{business.description}</p>
                <p className="text-[11px] text-gray-400 dark:text-slate-500">📍 {business.address}</p>
              </div>

              <Link
                to="/products"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition-colors shrink-0"
              >
                Products
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
