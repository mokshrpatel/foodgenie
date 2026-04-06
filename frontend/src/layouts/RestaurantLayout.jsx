import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Store, UtensilsCrossed, ClipboardList, LogOut } from 'lucide-react';

const RestaurantLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <span className="text-xl font-bold text-orange-500">Partner Portal</span>
        </div>
        <nav className="flex-grow px-4 mt-6 space-y-2">
          <Link to="/partner/dashboard" className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md">
            <Store className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/partner/menu" className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md">
            <UtensilsCrossed className="h-5 w-5" />
            <span>Menu Management</span>
          </Link>
          <Link to="/partner/orders" className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md">
            <ClipboardList className="h-5 w-5" />
            <span>Active Orders</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white w-full">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Pizza Hut - Central</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Store Status: <span className="text-green-500 font-bold">Open</span></span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
