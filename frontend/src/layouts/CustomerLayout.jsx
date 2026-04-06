import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-left">
      {/* Customer Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-orange-600">FoodGenie</Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="text-gray-900 border-b-2 border-orange-500 px-1 pt-1 text-sm font-medium">Home</Link>
                <Link to="/search" className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">Restaurants</Link>
                <Link to="/orders" className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">My Orders</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-gray-500 hover:text-orange-500 relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-2 bg-orange-600 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </Link>
              <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white text-center py-8 mt-auto">
        <p>&copy; 2026 FoodGenie. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerLayout;
