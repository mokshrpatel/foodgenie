import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden mb-16 text-left shadow-2xl h-[500px] flex items-center justify-center animate-fade-in group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: `url('/hero.png')` }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>

      <div className="relative px-6 sm:px-12 flex flex-col justify-end h-full w-full max-w-5xl mx-auto pb-16 animate-slide-up">

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 mt-0 drop-shadow-md">
          Craving something <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-brand-500">delicious?</span>
        </h1>
        <p className="max-w-2xl text-lg sm:text-2xl text-gray-200 mb-10 font-light drop-shadow">
          Discover the top local restaurants and exclusive artisan dishes delivered right to your door.
        </p>

        <div className="w-full max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-brand-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white/20 text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all"
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
