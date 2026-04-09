import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Upload, Image as ImageIcon, Loader } from 'lucide-react';
import { API_URL } from '../../config';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <span className={`text-sm font-semibold flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
        <TrendingUp className="w-4 h-4 ml-1" />
      </span>
    </div>
  </div>
);

export default function OwnerDashboard() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/orders/restaurant`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Initial fetch
    const intervalId = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, [token]);

  const toggleRestaurantStatus = async () => {
    if (!user) return;
    setTogglingStatus(true);
    try {
      const res = await fetch(`${API_URL}/api/users/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isOpen: !user.isOpen })
      });
      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...user, isOpen: data.isOpen };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setTogglingStatus(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1. Upload image to disk
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload image');
      const { imageUrl } = await uploadRes.json();

      // 2. Update user profile with new imageUrl
      const updateRes = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl })
      });

      if (!updateRes.ok) throw new Error('Failed to update profile');
      const updatedUser = await updateRes.json();

      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert('Profile picture updated successfully!');

    } catch (error) {
      console.error(error);
      alert('Error updating image. Is the backend running?');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left text-gray-900">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Restaurant Dashboard</h1>
            <button
              onClick={toggleRestaurantStatus}
              disabled={togglingStatus}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${user.isOpen ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
            >
              {user.isOpen ? 'Currently Open' : 'Currently Closed'}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening at {user.name} today.</p>
        </div>

        {/* Profile Picture Upload Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-orange-200 shrink-0">
            {user.imageUrl ? (
              <img src={`${API_URL}${user.imageUrl}`} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Restaurant Photo</h3>
            <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
              {uploading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}`} icon={DollarSign} trend={12.5} />
        <StatCard title="Orders Today" value={orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString() && o.status !== 'cancelled').length} icon={ShoppingBag} trend={8.2} />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} trend={4.5} />
        <StatCard title="Avg. Order Value" value={`$${(orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalAmount, 0) / (orders.filter(o => o.status !== 'cancelled').length || 1)).toFixed(2)}`} icon={DollarSign} trend={5.1} />
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-dark-700">
                <th className="pb-4 font-semibold">Order ID</th>
                <th className="pb-4 font-semibold">Customer</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold">Amount</th>
                <th className="pb-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">No recent orders.</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="group hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="py-4 font-medium text-gray-900 dark:text-white">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                  <td className="py-4 text-gray-600 dark:text-gray-300">{order.customer?.name || 'Unknown'}</td>
                  <td className="py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full outline-none border-none
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 text-gray-900 dark:text-white font-medium">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-4 text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
