import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurant/${restaurant.id}`} 
      className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] duration-500 border border-gray-100 hover:-translate-y-2 text-left"
    >
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {restaurant.isPromoted && (
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-[10px] sm:text-xs font-black tracking-widest uppercase text-orange-600 rounded-full shadow-sm">
              Featured
            </span>
          </div>
        )}


      </div>

      <div className="p-6 relative bg-white flex-grow flex flex-col justify-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-1 mb-3 group-hover:text-orange-500 transition-colors duration-300">
          {restaurant.name}
        </h3>
        
        <div className="flex items-start text-gray-500 group-hover:text-gray-600 transition-colors">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 text-orange-400 shrink-0" />
          <p className="text-sm sm:text-base font-medium leading-relaxed line-clamp-2">
            {restaurant.address}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
