import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config';

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

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
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, [token]);

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
        fetchOrders(); // Refresh immediately after update
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'accepted': return <CheckCircle className="w-5 h-5 text-indigo-500" />;
      case 'preparing': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'out_for_delivery': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered': return <Package className="w-5 h-5 text-green-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Filter out cancelled and delivered orders, keep active ones at the top
  const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-left">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Manage kitchen preparations and live order states.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No active orders right now</h3>
          <p className="text-gray-500 mt-2">New orders will magically appear here to be prepared.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeOrders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
              {/* Colored left trim indicating status */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.status === 'delivered' ? 'bg-green-500' :
                  order.status === 'pending' ? 'bg-orange-500' :
                    order.status === 'preparing' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />

              {/* Items column */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                      Customer: {order.customer?.name || 'Unknown'} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="font-bold text-lg text-orange-600">₹{order.totalAmount?.toFixed(2)}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Items to Prepare</h4>
                  <ul className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-gray-800">
                        <span className="font-semibold">
                          <span className="text-orange-600 font-black mr-2">{item.quantity}x</span>
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Controls column */}
              <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Actions</label>

                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateOrderStatus(order._id, 'preparing')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
                        Accept
                      </button>
                      <button onClick={() => updateOrderStatus(order._id, 'cancelled')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors shadow-sm border border-gray-200">
                        Reject
                      </button>
                    </div>
                  )}

                  {order.status === 'preparing' && (
                    <button onClick={() => updateOrderStatus(order._id, 'out_for_delivery')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm shadow-orange-500/20">
                      Out for Delivery
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs font-semibold leading-relaxed border border-blue-100 text-center">
                      Awaiting Customer Delivery Confirmation
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex items-center justify-end text-sm font-semibold capitalize">
                  <span className="mr-2 text-gray-500">Status:</span>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(order.status)}
                    <span className={`
                        ${order.status === 'delivered' ? 'text-green-600' :
                        order.status === 'cancelled' ? 'text-red-600' :
                          order.status === 'preparing' ? 'text-yellow-600' :
                            'text-blue-600'}
                    `}>{order.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
