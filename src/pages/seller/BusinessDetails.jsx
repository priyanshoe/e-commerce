import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import {
  Store,
  Package,
  Boxes,
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const BusinessDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinessAndProducts = async () => {
      try {
        setLoading(true);
        const [bizRes, prodRes] = await Promise.all([
          api.get(`/businesses/${id}`),
          api.get('/products', { params: { businessId: id } }),
        ]);

        const biz = bizRes.data;

        // Security / Ownership check
        if (String(biz.sellerId) !== String(user?.id) && user?.role !== 'ADMIN') {
          alert('Access denied: You do not own this business.');
          navigate('/seller/businesses');
          return;
        }

        setBusiness(biz);
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load business details:', err);
        setError('Business not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndProducts();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    const confirmMsg =
      products.length > 0
        ? `Warning: "${business.name}" contains ${products.length} product(s).\n\nDeleting this business will also remove its associated products.\n\nAre you sure you want to proceed?`
        : `Are you sure you want to delete "${business.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.delete(`/businesses/${id}`);
      navigate('/seller/businesses');
    } catch (err) {
      console.error('Failed to delete business:', err);
      alert('Failed to delete business.');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading business details..." />;
  }

  if (error || !business) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Business Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Unable to load business details.'}</p>
        <Link
          to="/seller/businesses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Businesses</span>
        </Link>
      </div>
    );
  }

  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

  return (
    <div id="business-details-page" className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/seller/businesses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Businesses</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/seller/businesses/${business.id}/edit`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 bg-white border border-rose-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Business Overview Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Store className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">{business.name}</h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                {business.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">{business.description}</p>
          </div>

          <Link
            to={`/seller/businesses/${business.id}/products`}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products ({products.length})</span>
          </Link>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{business.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{business.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Products</span>
              <span className="text-xl font-bold text-slate-900 block">{products.length}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Stock In Warehouse</span>
              <span className="text-xl font-bold text-slate-900 block">{totalStock} Units</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products in this business */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Products in this Business</h2>
          <Link
            to={`/seller/businesses/${business.id}/products/create`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No products added yet</p>
            <p className="text-xs text-slate-400">Add products to this business catalog to start selling.</p>
            <Link
              to={`/seller/businesses/${business.id}/products/create`}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Product</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-xs text-slate-900 truncate">{product.name}</h3>
                    <p className="text-[11px] text-slate-500">${Number(product.price).toFixed(2)}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  <Link
                    to={`/seller/businesses/${business.id}/products/edit/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold px-2 py-1 rounded"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetails;
