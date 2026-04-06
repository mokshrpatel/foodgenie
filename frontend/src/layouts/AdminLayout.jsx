import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Users, CheckCircle, Settings, LogOut } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <span className="text-xl font-bold text-blue-500">Admin Control</span>
        </div>
        <nav className="flex-grow px-4 mt-6 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center space-x-2 text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md">
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-2 text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md">
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/approvals" className="flex items-center space-x-2 text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span>Approvals</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-2 text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md">
            <Settings className="h-5 w-5" />
            <span>System Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-2 text-slate-400 hover:text-white w-full">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-end">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-sm font-medium text-slate-700">Super Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
