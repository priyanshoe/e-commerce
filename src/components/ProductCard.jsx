import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, businessName }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      alert('Please sign in with a customer account to add items to your cart.');
      return;
    }

    if (product.stock <= 0) return;

    setAdding(true);
    const result = await addToCart(product.id, 1);
    setAdding(false);

    if (result.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1800);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200 flex flex-col justify-between"
    >
      {/* Image & Badges */}
      <div className="relative aspect-4/3 bg-gray-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs text-gray-700 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs">
          {product.category || 'General'}
        </span>

        {/* Stock Status Badge */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isOutOfStock
              ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : product.stock < 5
              ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          }`}
        >
          {isOutOfStock ? 'Sold Out' : `${product.stock} in stock`}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {businessName && (
            <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 line-clamp-1 mb-1">
              {businessName}
            </p>
          )}
          <Link
            id={`product-title-link-${product.id}`}
            to={`/products/${product.id}`}
            className="block font-bold text-gray-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 text-base"
          >
            {product.name}
          </Link>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 block">Price</span>
            <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              id={`view-product-${product.id}`}
              to={`/products/${product.id}`}
              className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {(!user || user.role === 'CUSTOMER') && (
              <button
                id={`add-to-cart-btn-${product.id}`}
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Out' : 'Add'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
