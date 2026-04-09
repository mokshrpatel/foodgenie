import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { API_URL } from '../../config';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, cartTotal, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = async () => {
    setIsPlacingOrder(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to place an order");
        setIsPlacingOrder(false);
        return;
      }

      // Group items by restaurant format
      const groupedItems = cartItems.reduce((acc, item) => {
        if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
        acc[item.restaurantId].push(item);
        return acc;
      }, {});

      // Send a separate order for each restaurant incrementally or parallel
      const orderPromises = Object.keys(groupedItems).map(rId => {
        const items = groupedItems[rId];
        const restaurantTotal = items.reduce((total, i) => total + (i.price * i.quantity), 0);
        
        return fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderItems: items.map(i => ({
              menuItem: i._id,
              name: i.name,
              quantity: i.quantity,
              price: i.price
            })),
            restaurantId: rId,
            totalAmount: restaurantTotal
          })
        });
      });

      const responses = await Promise.all(orderPromises);
      const allSuccess = responses.every(r => r.ok);

      if (allSuccess) {
        setOrderComplete(true);
        clearCart();
        setTimeout(() => {
          setOrderComplete(false);
          onClose();
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Error placing order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-left">
          {orderComplete ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold">Order Placed!</h3>
              <p className="text-gray-500">Your food is being prepared.</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <ShoppingBag className="w-12 h-12 mb-4 text-gray-300" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div className="flex-1 mr-4">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-orange-600 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button onClick={() => updateQuantity(item._id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!orderComplete && cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4 text-lg font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isPlacingOrder}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {isPlacingOrder ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
