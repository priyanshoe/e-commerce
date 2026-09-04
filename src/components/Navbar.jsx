import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShoppingCart,
  Store,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Package,
  Layers,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { totalItemsCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleQuickSwitch = async (role) => {
    const switchedUser = await switchDemoRole(role);
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    if (switchedUser) {
      if (switchedUser.role === 'CUSTOMER') navigate('/customer/dashboard');
      else if (switchedUser.role === 'SELLER') navigate('/seller/dashboard');
      else if (switchedUser.role === 'ADMIN') navigate('/admin/dashboard');
    }
  };

  const activeLinkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-semibold transition-colors'
      : 'flex items-center gap-2 px-3.5 py-1.5 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors';

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              id="brand-logo-link"
              to="/"
              className="flex items-center gap-2.5 hover:opacity-95 transition-opacity"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs">
                Q
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">QuickCart</span>
                <span className="text-gray-400 dark:text-slate-500 font-normal ml-2 text-xs uppercase tracking-widest hidden sm:inline">
                  15 minutes
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav id="desktop-nav" className="hidden md:flex items-center gap-1">
              {/* Public & Customer Links */}
              {(!isAuthenticated() || user?.role === 'CUSTOMER') && (
                <>
                  <NavLink id="nav-home" to="/" className={activeLinkClass} end>
                    Home
                  </NavLink>
                  <NavLink id="nav-products" to="/products" className={activeLinkClass}>
                    Catalog
                  </NavLink>
                </>
              )}

              {/* Customer Specific */}
              {isAuthenticated && user?.role === 'CUSTOMER' && (
                <>
                  <NavLink id="nav-customer-dashboard" to="/customer/dashboard" className={activeLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink id="nav-customer-orders" to="/customer/orders" className={activeLinkClass}>
                    <Package className="w-4 h-4" />
                    Orders
                  </NavLink>
                </>
              )}

              {/* Seller Specific */}
              {isAuthenticated && user?.role === 'SELLER' && (
                <>
                  <NavLink id="nav-seller-dashboard" to="/seller/dashboard" className={activeLinkClass} end>
                    Dashboard
                  </NavLink>
                  <NavLink id="nav-seller-businesses" to="/seller/businesses" className={activeLinkClass}>
                    <Store className="w-4 h-4" />
                    Businesses
                  </NavLink>
                  <NavLink id="nav-seller-orders" to="/seller/orders" className={activeLinkClass}>
                    <Package className="w-4 h-4" />
                    Orders
                  </NavLink>
                </>
              )}

              {/* Admin Specific */}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <>
                  <NavLink id="nav-admin-dashboard" to="/admin/dashboard" className={activeLinkClass} end>
                    Dashboard
                  </NavLink>
                  <NavLink id="nav-admin-users" to="/admin/users" className={activeLinkClass}>
                    <User className="w-4 h-4" />
                    Users
                  </NavLink>
                  <NavLink id="nav-admin-businesses" to="/admin/businesses" className={activeLinkClass}>
                    <Store className="w-4 h-4" />
                    Businesses
                  </NavLink>
                  <NavLink id="nav-admin-products" to="/admin/products" className={activeLinkClass}>
                    <Layers className="w-4 h-4" />
                    Products
                  </NavLink>
                  <NavLink id="nav-admin-orders" to="/admin/orders" className={activeLinkClass}>
                    <Package className="w-4 h-4" />
                    Orders
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-slate-300 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Quick Demo Switcher Pill */}
            {/* <div className="relative">
              <button
                id="demo-switcher-btn"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                title="Quick Demo Role Switcher"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Role Switch</span>
                <ChevronDown className="w-3 h-3 text-gray-500 dark:text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div
                  id="demo-switcher-dropdown"
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-850 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-1.5 border-b border-gray-100 dark:border-slate-700 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleQuickSwitch('CUSTOMER')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>John Customer</span>
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">CUSTOMER</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('SELLER')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Sarah Seller</span>
                    <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[10px] px-1.5 py-0.5 rounded font-bold">SELLER</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('ADMIN')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Alex Admin</span>
                    <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-[10px] px-1.5 py-0.5 rounded font-bold">ADMIN</span>
                  </button>
                </div>
              )}
            </div> */}

            {/* Customer Cart Icon (Only if Guest or Customer) */}
            {(!isAuthenticated() || user?.role === 'CUSTOMER') && (
              <Link
                id="cart-icon-btn"
                to="/customer/cart"
                className="relative p-2 text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span
                    id="cart-count-badge"
                    className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs"
                  >
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Authenticated User Status & Profile Indicator */}
            {isAuthenticated() ? (
              <div className="flex items-center gap-3">
                {/* Role Pill */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700">
                  <div
                    className={`w-2 h-2 rounded-full ${user.role === 'ADMIN'
                      ? 'bg-rose-500'
                      : user.role === 'SELLER'
                        ? 'bg-green-500'
                        : 'bg-indigo-500'
                      }`}
                  />
                  <span className="text-[11px] font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>

                {/* User Info & Avatar */}
                <div className="hidden sm:flex items-center gap-2.5">
                  <div className="text-right leading-tight">
                    <p className="text-xs font-semibold text-gray-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">{user.email}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                    {getInitials(user.name)}
                  </div>
                </div>

                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  id="nav-login-btn"
                  to="/login"
                  className="text-xs font-semibold text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  id="nav-register-btn"
                  to="/register"
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-xs transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated && (
            <div className="p-3 bg-gray-50 dark:bg-slate-800/80 rounded-xl mb-3 flex items-center justify-between border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">{user.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                {user.role}
              </span>
            </div>
          )}

          {/* Theme Toggler in Mobile Drawer */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 mb-2">
            <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-600"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-gray-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {(!isAuthenticated || user?.role === 'CUSTOMER') && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Browse Catalog
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    Customer Dashboard
                  </Link>
                  <Link
                    to="/customer/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    Cart ({totalItemsCount})
                  </Link>
                  <Link
                    to="/customer/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    My Orders
                  </Link>
                </>
              )}
            </>
          )}

          {isAuthenticated && user?.role === 'SELLER' && (
            <>
              <Link
                to="/seller/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Seller Dashboard
              </Link>
              <Link
                to="/seller/businesses"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                My Businesses
              </Link>
              <Link
                to="/seller/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Seller Orders
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/businesses"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Manage Businesses
              </Link>
              <Link
                to="/admin/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Manage Orders
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-3">
              Switch Demo Role
            </div>
            <div className="grid grid-cols-3 gap-2 px-3">
              <button
                onClick={() => handleQuickSwitch('CUSTOMER')}
                className="py-1.5 text-center text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg cursor-pointer"
              >
                Customer
              </button>
              <button
                onClick={() => handleQuickSwitch('SELLER')}
                className="py-1.5 text-center text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg cursor-pointer"
              >
                Seller
              </button>
              <button
                onClick={() => handleQuickSwitch('ADMIN')}
                className="py-1.5 text-center text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
