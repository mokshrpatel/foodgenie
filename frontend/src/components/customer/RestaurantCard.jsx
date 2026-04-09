import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full text-left">
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
        </div>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-1 flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
          {restaurant.address}
        </p>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
            {restaurant.deliveryTime}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
