import React, { useState, useMemo } from 'react';
import HeroSection from '../../components/customer/HeroSection';
import CategoryFilters from '../../components/customer/CategoryFilters';
import RestaurantCard from '../../components/customer/RestaurantCard';
import { mockRestaurants, mockCategories } from '../../data/mockData';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter Logic
  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter((restaurant) => {
      // 1. Text Search Filter
      const matchesSearch = 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 2. Category Filter
      const matchesCategory = 
        selectedCategory === 'All' || 
        restaurant.categories.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full text-left">
      {/* Search state bubbles down to HeroSection */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Explore Categories</h2>
        </div>
        <CategoryFilters 
          categories={mockCategories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : selectedCategory === 'All' 
                ? 'Popular Restaurants' 
                : `${selectedCategory} Restaurants`
            }
          </h2>
          <p className="text-sm text-gray-500 font-medium">{filteredRestaurants.length} places found</p>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-700 mb-2">No restaurants found 😕</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or category filter.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2 bg-orange-100 text-orange-700 font-medium rounded-full hover:bg-orange-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
