import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative bg-orange-600 rounded-2xl overflow-hidden mb-12 text-left">
      {/* Decorative pattern (mocked with gradient) */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-90"></div>
      
      <div className="relative px-6 py-16 sm:px-12 sm:py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 mt-0">
          Hungry? We got you.
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-orange-100 mb-10">
          Discover the best local restaurants, fast food, and healthy options delivered straight to your door.
        </p>
        
        <div className="w-full max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50 text-lg shadow-lg"
            placeholder="Search for restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
