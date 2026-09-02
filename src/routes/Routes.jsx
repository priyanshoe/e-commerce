import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Orders from '../pages/customer/Orders';
import OrderDetails from '../pages/customer/OrderDetails';

// Seller Pages
import SellerDashboard from '../pages/seller/SellerDashboard';
import Businesses from '../pages/seller/Businesses';
import CreateBusiness from '../pages/seller/CreateBusiness';
import BusinessDetails from '../pages/seller/BusinessDetails';
import EditBusiness from '../pages/seller/EditBusiness';
import BusinessProducts from '../pages/seller/BusinessProducts';
import CreateProduct from '../pages/seller/CreateProduct';
import EditProduct from '../pages/seller/EditProduct';
import SellerOrders from '../pages/seller/SellerOrders';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminBusinesses from '../pages/admin/AdminBusinesses';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ================================================================= */}
        {/* 1. PUBLIC ROUTES */}
        {/* ================================================================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* ================================================================= */}
        {/* 2. CUSTOMER ROUTES (Protected: CUSTOMER) */}
        {/* ================================================================= */}
        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/checkout" element={<Checkout />} />
          <Route path="/customer/orders" element={<Orders />} />
          <Route path="/customer/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* ================================================================= */}
        {/* 3. SELLER ROUTES (Protected: SELLER) */}
        {/* ================================================================= */}
        <Route element={<ProtectedRoute role="SELLER" />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/businesses" element={<Businesses />} />
          <Route path="/seller/businesses/create" element={<CreateBusiness />} />
          <Route path="/seller/businesses/:id" element={<BusinessDetails />} />
          <Route path="/seller/businesses/:id/edit" element={<EditBusiness />} />
          <Route path="/seller/businesses/:id/products" element={<BusinessProducts />} />
          <Route path="/seller/businesses/:id/products/create" element={<CreateProduct />} />
          <Route
            path="/seller/businesses/:id/products/edit/:productId"
            element={<EditProduct />}
          />
          <Route path="/seller/orders" element={<SellerOrders />} />
        </Route>

        {/* ================================================================= */}
        {/* 4. ADMIN ROUTES (Protected: ADMIN) */}
        {/* ================================================================= */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/businesses" element={<AdminBusinesses />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>

        {/* ================================================================= */}
        {/* 5. CATCH-ALL / 404 */}
        {/* ================================================================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
