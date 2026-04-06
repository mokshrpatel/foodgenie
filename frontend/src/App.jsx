import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import RestaurantLayout from './layouts/RestaurantLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoutes from './routes/ProtectedRoutes';

import Home from './pages/customer/Home';

// --- Placeholder Pages ---
const Search = () => <div className="text-center mt-10 text-2xl font-semibold">Search Restaurants 🔍</div>;
const Login = () => (
  <form className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Email address</label>
      <div className="mt-1">
        <input type="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
      </div>
    </div>
    <button type="button" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none">
      Sign in (Mock)
    </button>
  </form>
);

const OwnerDashboard = () => <div className="text-xl font-medium">Restaurant Owner Overview 📈</div>;
const AdminDashboard = () => <div className="text-xl font-medium text-blue-600">System Admin Info ⚙️</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<div className="text-center">Registration Page</div>} />
        </Route>

        {/* CUSTOMER ROUTES */}
        {/* Notice how the CustomerLayout acts as a wrapper for these routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Route>

        {/* RESTAURANT OWNER ROUTES */}
        <Route element={<ProtectedRoutes allowedRoles={['OWNER']} />}>
          <Route path="/partner" element={<RestaurantLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="menu" element={<div>Manage Menu Items</div>} />
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