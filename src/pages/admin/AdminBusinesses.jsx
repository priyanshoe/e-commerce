import { useState, useEffect, useMemo } from 'react';
import Loading from '../../components/Loading';
import { Store, Search, Mail, Phone, MapPin, Package } from 'lucide-react';
import BusinesseService from '../../services/BusinesseService';
import ProductService from '../../services/ProductService';
import AuthService from '../../services/AuthService';

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminBusinessData = async () => {
      try {
        setLoading(true);
        const [bizRes, prodRes, userRes] = await Promise.all([
          BusinesseService.getBusinesses(),
          ProductService.getProducts(),
          AuthService.findAll(),
        ]);

        setBusinesses(bizRes.data);
        setProducts(prodRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error('Failed to load admin businesses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminBusinessData();
  }, []);

  const filteredBusinesses = useMemo(() => {
    if (!searchTerm.trim()) return businesses;
    const q = searchTerm.toLowerCase();
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
    );
  }, [businesses, searchTerm]);

  if (loading) {
    return <Loading fullScreen message="Loading registered businesses..." />;
  }

  return (
    <div id="admin-businesses-page" className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Business Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review business profiles, ownership, and operational status.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search businesses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Business Name</th>
                <th className="px-5 py-3.5">Owner / Seller</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Address</th>
                <th className="px-5 py-3.5">Products</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBusinesses.map((b) => {
                const seller = users.find((u) => u.id === b.sellerId);
                const bizProds = products.filter((p) => p.businessId === b.id);

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">#{b.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{b.name}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{b.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{seller?.name || `Seller #${b.sellerId}`}</p>
                      <p className="text-[11px] text-slate-400">{seller?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 space-y-0.5">
                      <p>{b.email}</p>
                      <p className="text-[11px] text-slate-400">{b.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {b.address}
                    </td>
                    <td className="px-5 py-4 font-bold text-indigo-600">
                      {bizProds.length} item(s)
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : " bg-rose-100 text-rose-800"} uppercase`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBusinesses;
