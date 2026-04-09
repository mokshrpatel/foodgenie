import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Clock, CheckCircle, Package } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../../config';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || ''
        });

        // Fetch orders
        const fetchOrders = async () => {
          try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/orders/myorders`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setOrders(data);
            }
          } catch (error) {
            console.error('Failed to fetch orders', error);
          }
        };
        fetchOrders();
      } catch (e) {
        console.error('Failed to parse user details', e);
      }
    }
  }, []);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    // If we rendering this component without a user, it might be loading or unauthorized
    // but the ProtectedRoutes should catch this first.
    return <div className="p-8 text-center text-gray-500">Loading user data...</div>;
  }

  // Real Orders Data fetched from backend

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-8">
      
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Account Settings / User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-12 left-6 h-24 w-24 bg-white rounded-full p-2 shadow-md">
                <div className="h-full w-full bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <User size={40} />
                </div>
              </div>
              <div className="pt-14">
                {isEditing ? (
                  <div className="space-y-4 text-left mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="block w-full rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border border-gray-300" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500 font-medium capitalize">{user.role}</p>
                  </>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="block w-full rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border border-gray-300" placeholder="Enter phone number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="block w-full rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border border-gray-300" placeholder="Enter address" rows="2" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-3 text-gray-400 md:flex-shrink-0" />
                      <span className="truncate whitespace-normal">{user.phone || 'No phone number provided'}</span>
                    </div>
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-1 md:flex-shrink-0" />
                      <span>{user.address || 'No address provided'}</span>
                    </div>
                  </>
                )}
              </div>

              {successMessage && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                  {successMessage}
                </div>
              )}

              {isEditing ? (
                <div className="flex gap-3 mt-8">
                  <button onClick={handleUpdateProfile} disabled={isUpdating} className="flex-1 bg-orange-600 text-white hover:bg-orange-700 font-medium py-2.5 rounded-lg transition-colors border border-transparent">
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => {
                    setIsEditing(false); 
                    setFormData({
                      name: user.name || '', 
                      phone: user.phone || '', 
                      address: user.address || ''
                    });
                  }} className="flex-1 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors border border-gray-300">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full mt-8 bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium py-2.5 rounded-lg transition-colors border border-orange-200 cursor-pointer">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2 h-5 w-5 text-orange-500" />
              Account Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-3xl font-bold text-orange-600">{orders.length}</p>
                <p className="text-xs text-gray-600 mt-1 uppercase tracking-wide font-semibold">Total Orders</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-3xl font-bold text-gray-800">0</p>
                <p className="text-xs text-gray-600 mt-1 uppercase tracking-wide font-semibold">Saved Places</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="mr-2 h-6 w-6 text-orange-500" />
                Recent Orders
              </h2>
              <button className="text-orange-600 font-medium hover:text-orange-700 text-sm">View All</button>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent orders yet.</div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors bg-gray-50/50 flex flex-col sm:flex-row gap-4">
                    
                    {/* Restaurant Image */}
                    <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={order.restaurant?.imageUrl ? `${API_URL}${order.restaurant.imageUrl}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&h=200&q=80'} alt={order.restaurant?.name || 'Restaurant'} className="h-full w-full object-cover" />
                    </div>
                    
                    {/* Order Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-gray-900">{order.restaurant?.name || 'Restaurant'}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status || 'pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 text-left">
                          {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 border-t border-gray-200/60 pt-3">
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} <span className="mx-2">•</span> {order._id.substring(0, 8).toUpperCase()}
                        </div>
                        <div className="font-bold text-gray-900">
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
