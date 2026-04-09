import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/customer/CartSidebar';

const CustomerLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user details', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

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
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsCartOpen(true)} className="text-gray-500 hover:text-orange-500 relative mr-4">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-orange-600 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>}
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                  >
                    <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <User size={18} />
                    </div>
                    <span className="hidden sm:inline">{user.name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 text-sm font-medium transition-colors ml-4"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700">
                  Login
                </Link>
              )}
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
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default CustomerLayout;
