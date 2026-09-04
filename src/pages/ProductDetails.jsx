import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Store,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  AlertCircle,
} from 'lucide-react';
import ProductService from '../services/ProductService';
import BusinesseService from '../services/BusinesseService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRes = await ProductService.getProduct(id);
        const prodData = productRes.data;
        setProduct(prodData);

        if (prodData.businessId) {
          const bizRes = await BusinesseService.getBusinessById(prodData.businessId);
          setBusiness(bizRes.data);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Product not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      alert('Only customers can add items to cart. Please log in with a customer account.');
      return;
    }

    if (quantity > product.stock) {
      alert('Cannot add more than available stock.');
      return;
    }

    setAdding(true);
    const res = await addToCart(product.id, quantity);
    setAdding(false);

    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Fetching product details..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Unavailable</h2>
        <p className="text-xs text-gray-500 dark:text-slate-400">{error || 'This product does not exist.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div id="product-details-page" className="max-w-5xl mx-auto space-y-8 pb-16">

      {/* Back button */}
      <Link
        id="back-to-products-btn"
        to={user.role === "ADMIN" ? "/admin/products" : "/products"}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs transition-colors duration-200">

        {/* Product Image */}
        <div className="relative aspect-square rounded-lg bg-gray-100 dark:bg-slate-800 overflow-hidden border border-gray-100 dark:border-slate-700">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs text-gray-800 dark:text-slate-200 text-xs font-semibold px-3 py-1 rounded-md shadow-xs">
            {product.category || 'General'}
          </span>
        </div>

        {/* Info & Purchase */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">

            {/* Business Seller Header */}
            {business && (
              <div className="flex items-center gap-2 p-2.5 bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 rounded-lg">
                <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div className="text-xs">
                  <span className="text-gray-500 dark:text-slate-400">Sold by: </span>
                  <span className="font-semibold text-gray-900 dark:text-slate-200">{business.name}</span>
                </div>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            {/* Price & Stock */}
            <div className="flex items-center justify-between py-3 border-y border-gray-100 dark:border-slate-800">
              <div>
                <span className="text-xs text-gray-400 dark:text-slate-500 block font-medium">Price</span>
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 dark:text-slate-500 block font-medium">Stock Status</span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md ${isOutOfStock
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                    : product.stock < 5
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    }`}
                >
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} units available`}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
                Description
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Action Box */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            {/* Quantity Selector */}
            {!isOutOfStock && (!user || user.role === 'CUSTOMER') && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-gray-800 dark:text-slate-200">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1.5 text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  Total: ${(Number(product.price) * quantity).toFixed(2)}
                </span>
              </div>
            )}

            {/* Add to Cart button */}
            {(!user || user.role === 'CUSTOMER') && (
              <button
                id="product-details-add-btn"
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock}
                className={`w-full py-3.5 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${added
                  ? 'bg-emerald-600 text-white'
                  : isOutOfStock
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added {quantity} to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                <span>Fast Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                <span>REST Mock Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
