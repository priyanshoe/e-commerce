import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] dark:bg-slate-950 font-sans text-[var(--foreground)] dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="h-14 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 sm:px-8 text-[11px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-widest shrink-0 mt-auto transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-[10px]">
            L
          </div>
          <span className="text-gray-600 dark:text-slate-300 font-semibold lowercase first-letter:uppercase">
            LearnerStore Commerce
          </span>
          <span className="hidden sm:inline text-gray-400 dark:text-slate-600">
            • React & REST API Platform
          </span>
        </div>

        <div className="flex items-center gap-5">
          <Link to="/products" className="hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
            Catalog
          </Link>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold hidden md:inline">
            REST API: Connected
          </span>
          <span className="hidden md:inline text-gray-400 dark:text-slate-600">
            DB.JSON V1.0.4
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
