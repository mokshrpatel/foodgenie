import React from 'react';
import { Star, Clock, Truck } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full text-left">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {restaurant.isPromoted && (
          <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
            PROMOTED
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-sm font-semibold">
            <Star className="w-3.5 h-3.5 mr-1 fill-current" />
            {restaurant.rating}
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-3">
          {restaurant.categories.join(' • ')} • {restaurant.priceRange}
        </p>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
            {restaurant.deliveryTime}
          </div>
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-1.5 text-gray-400" />
            {restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
