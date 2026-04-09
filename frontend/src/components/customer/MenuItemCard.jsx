import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { API_URL } from '../../config';

const MenuItemCard = ({ item, restaurantId, isOpen = true }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (isOpen) {
      addToCart(item, restaurantId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {item.imageUrl && (
            <img src={`${API_URL}${item.imageUrl}`} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
        )}
        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
        <button 
          onClick={handleAdd}
          disabled={!isOpen}
          className={`p-2 rounded-full transition-colors flex items-center justify-center ${
            isOpen 
              ? 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title={!isOpen ? "Restaurant is currently closed" : "Add to cart"}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
