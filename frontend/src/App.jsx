import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import CustomerMenu from './pages/CustomerMenu';
import CartPage from './pages/CartPage';
import StaffDashboard from './pages/StaffDashboard';
import StaffLogin from './pages/StaffLogin';
import OrderStatusPage from './pages/OrderStatusPage';
import HomePage from './pages/HomePage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminTables from './pages/admin/AdminTables';
import AdminReports from './pages/admin/AdminReports';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOrders from './pages/admin/AdminOrders';
import AdminChangePassword from './pages/admin/AdminChangePassword';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Admin protected route
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

// Staff protected route — allows both STAFF and ADMIN tokens
const ProtectedStaffRoute = ({ children }) => {
  const token = localStorage.getItem('staffToken') || localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/staff/login" replace />;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (['ADMIN', 'STAFF'].includes(payload.role)) return children;
  } catch { /* invalid token */ }
  return <Navigate to="/staff/login" replace />;
};


function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<CustomerMenu />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-status" element={<OrderStatusPage />} />

            {/* Staff Routes */}
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/staff" element={
              <ProtectedStaffRoute>
                <StaffDashboard />
              </ProtectedStaffRoute>
            } />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="tables" element={<AdminTables />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="password" element={<AdminChangePassword />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;