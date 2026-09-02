import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import {
  Package,
  Plus,
  ArrowLeft,
  Edit2,
  Trash2,
  Boxes,
  Eye,
  Store,
  AlertCircle,
} from 'lucide-react';

const BusinessProducts = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBusinessAndProducts = async () => {
    try {
      setLoading(true);
      const [bizRes, prodRes] = await Promise.all([
        api.get(`/businesses/${id}`),
        api.get('/products', { params: { businessId: id } }),
      ]);

      const biz = bizRes.data;

      // Ownership security check
      if (String(biz.sellerId) !== String(user?.id) && user?.role !== 'ADMIN') {
        alert('Access denied: You do not own this business.');
        navigate('/seller/businesses');
        return;
      }

      setBusiness(biz);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Failed to load business products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessAndProducts();
  }, [id, user]);

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      setDeletingId(productId);
      await api.delete(`/products/${productId}`);
      await fetchBusinessAndProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading business catalog..." />;
  }

  if (!business) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Business Not Found</h2>
        <Link to="/seller/businesses" className="text-xs text-indigo-600 font-semibold underline">
          Back to Businesses
        </Link>
      </div>
    );
  }

  return (
    <div id="business-products-page" className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to={`/seller/businesses/${business.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {business.name} Overview</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Manage Products — {business.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, update, and manage inventory for this storefront.
          </p>
        </div>

        <Link
          id="add-product-btn"
          to={`/seller/businesses/${business.id}/products/create`}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Products in this Store</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            This business does not have any items listed yet. Add your first product to begin selling!
          </p>
          <Link
            to={`/seller/businesses/${business.id}/products/create`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Product</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">Added Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Thumbnail + Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prod.image ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/products/${prod.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 text-sm"
                          >
                            {prod.name}
                          </Link>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {prod.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {prod.category || 'General'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 font-bold text-slate-900 text-sm">
                      ${Number(prod.price).toFixed(2)}
                    </td>

                    {/* Stock Badge */}
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stock <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : prod.stock < 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-4 text-slate-400 text-[11px]">
                      {prod.createdAt || 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/products/${prod.id}`}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          id={`edit-prod-btn-${prod.id}`}
                          to={`/seller/businesses/${business.id}/products/edit/${prod.id}`}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          id={`delete-prod-btn-${prod.id}`}
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          disabled={deletingId === prod.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProducts;
