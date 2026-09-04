import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import { Package, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import BusinesseService from '../../services/BusinesseService';
import ProductService from '../../services/ProductService';

const EditProduct = () => {
  const { id: businessId, productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
    stock: '',
  });

  useEffect(() => {
    const fetchProductAndBusiness = async () => {
      try {
        setLoading(true);
        const [bizRes, prodRes] = await Promise.all([
          BusinesseService.getBusinessById(businessId),
          ProductService.getProduct(productId),
        ]);

        const biz = bizRes.data;
        const prod = prodRes.data;

        // Security check: Must belong to seller
        if (String(biz.sellerId) !== String(user?.id) && user?.role !== 'ADMIN') {
          alert('Access denied: You do not own this business.');
          navigate('/seller/businesses');
          return;
        }

        setBusiness(biz);
        setFormData({
          name: prod.name || '',
          description: prod.description || '',
          price: prod.price || '',
          category: prod.category || 'Electronics',
          image: prod.image || '',
          stock: String(prod.stock ?? 0),
        });
      } catch (err) {
        console.error('Failed to load product for editing:', err);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndBusiness();
  }, [businessId, productId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || formData.stock === '') {
      setError('Please fill in product name, price, and stock.');
      return;
    }

    try {
      setSaving(true);
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image.trim(),
        stock: parseInt(formData.stock, 10),
      };
      await ProductService.update(productId, data)

      navigate(`/seller/businesses/${businessId}/products`);
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading product data..." />;
  }

  return (
    <div id="edit-product-page" className="max-w-2xl mx-auto space-y-6 pb-16">

      {/* Back Link */}
      <Link
        to={`/seller/businesses/${businessId}/products`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products ({business?.name})</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Edit Product
          </h1>
          <p className="text-xs text-slate-500">
            Belongs to <strong>{business?.name}</strong> (Business ID: {businessId})
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product Title / Name *
            </label>
            <input
              id="edit-product-name-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="edit-product-desc-input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Price ($ USD) *
              </label>
              <input
                id="edit-product-price-input"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Stock Quantity *
              </label>
              <input
                id="edit-product-stock-input"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                id="edit-product-category-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Electronics">Electronics</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Image URL
            </label>
            <input
              id="edit-product-image-input"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              to={`/seller/businesses/${businessId}/products`}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              id="update-product-submit-btn"
              type="submit"
              disabled={saving}
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
