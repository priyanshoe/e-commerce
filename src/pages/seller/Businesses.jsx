import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import {
  Store,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Package,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import BusinesseService from '../../services/BusinesseService';
import ProductService from '../../services/ProductService';

const Businesses = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBusinesses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [bizRes, prodRes] = await Promise.all([
        BusinesseService.getBusinessesByUser(user.id),
        ProductService.getProductsByBusinesse(user.id)
      ]);
      setBusinesses(bizRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Failed to load businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [user]);

  const handleDeleteBusiness = async (bizId, bizName, productCount) => {
    const confirmMessage =
      productCount > 0
        ? `Warning: "${bizName}" contains ${productCount} product(s).\n\nDeleting this business will also remove its associated products.\n\nAre you sure you want to continue?`
        : `Are you sure you want to delete the business "${bizName}"?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setDeletingId(bizId);
      await BusinesseService.deleteItem(bizId);;
      await fetchBusinesses();
    } catch (err) {
      console.error('Failed to delete business:', err);
      alert('Failed to delete business. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading your businesses..." />;
  }

  return (
    <div id="seller-businesses-page" className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Manage Businesses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            You can register and manage multiple distinct storefronts under your seller account.
          </p>
        </div>

        <Link
          id="create-business-btn"
          to="/seller/businesses/create"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Business</span>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Businesses Registered</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You need to register at least one business to start creating and selling products.
          </p>
          <Link
            to="/seller/businesses/create"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Business</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((business) => {
            const bizProducts = products.filter(
              (p) => String(p.businessId) === String(business.id)
            );

            return (
              <div
                key={business.id}
                id={`business-card-${business.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-snug">
                        {business.name}
                      </h2>
                      <span className="text-[11px] text-slate-400">
                        Registered on {business.createdAt || 'Recent'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${business.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : " bg-rose-100 text-rose-800"} uppercase tracking-wider`}>
                      {business.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {business.description}
                  </p>

                  {/* Business Details Grid */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{business.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{business.address}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-800 pt-1">
                      <Package className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{bizProducts.length} Product(s) Listed</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Link
                      id={`view-biz-${business.id}`}
                      to={`/seller/businesses/${business.id}`}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Link>

                    <Link
                      id={`edit-biz-${business.id}`}
                      to={`/seller/businesses/${business.id}/edit`}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                      title="Edit Business"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>

                    <button
                      id={`delete-biz-${business.id}`}
                      onClick={() =>
                        handleDeleteBusiness(business.id, business.name, bizProducts.length)
                      }
                      disabled={deletingId === business.id}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                      title="Delete Business"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>

                  <Link
                    id={`manage-products-biz-${business.id}`}
                    to={`/seller/businesses/${business.id}/products`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Manage Products</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Businesses;
