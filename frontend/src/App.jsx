import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import RestaurantLayout from './layouts/RestaurantLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoutes from './routes/ProtectedRoutes';

import Home from './pages/customer/Home';
import Profile from './pages/customer/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OwnerDashboard from './pages/partner/Dashboard';
import MenuManagement from './pages/partner/MenuManagement';
import AdminDashboard from './pages/admin/Dashboard';
import RestaurantDetails from './pages/customer/RestaurantDetails';

// --- Placeholder Pages ---
const Search = () => <div className="text-center mt-10 text-2xl font-semibold">Search Restaurants 🔍</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* CUSTOMER ROUTES */}
        {/* Notice how the CustomerLayout acts as a wrapper for these routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* RESTAURANT OWNER ROUTES */}
        <Route element={<ProtectedRoutes allowedRoles={['OWNER']} />}>
          <Route path="/partner" element={<RestaurantLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="orders" element={<div>Active Orders incoming...</div>} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoutes allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<div>Manage All Users</div>} />
            <Route path="approvals" element={<div>Approve New Restaurants</div>} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;