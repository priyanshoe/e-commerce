import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Redirect according to user role
      if (result.user.role === 'CUSTOMER') {
        navigate('/customer/dashboard');
      } else if (result.user.role === 'SELLER') {
        navigate('/seller/dashboard');
      } else if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div id="login-page" className="max-w-md mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6 transition-colors duration-200">

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sign In</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">Access your role-based e-commerce workspace</p>
        </div>

        {/* Quick Demo Credentials Panel */}
        <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 space-y-2">
          <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest text-center">
            Quick Fill Demo Accounts
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="demo-fill-customer"
              onClick={() => handleQuickLogin('john@example.com', '123456')}
              className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-gray-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer"
            >
              <span className="block font-bold">Customer</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">John</span>
            </button>

            <button
              type="button"
              id="demo-fill-seller"
              onClick={() => handleQuickLogin('sarah@seller.com', '123456')}
              className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-gray-700 dark:text-slate-200 hover:text-indigo-800 dark:hover:text-indigo-300 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer"
            >
              <span className="block font-bold">Seller</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">Sarah</span>
            </button>

            <button
              type="button"
              id="demo-fill-admin"
              onClick={() => handleQuickLogin('admin@shop.com', '123456')}
              className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-gray-700 dark:text-slate-200 hover:text-rose-800 dark:hover:text-rose-300 border border-gray-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-600 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer"
            >
              <span className="block font-bold">Admin</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">Alex</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              required
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
