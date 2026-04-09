import React, { useState, useEffect, useMemo } from 'react';
import HeroSection from '../../components/customer/HeroSection';
import RestaurantCard from '../../components/customer/RestaurantCard';
import { Loader } from 'lucide-react';
import { API_URL } from '../../config';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbRestaurants, setDbRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${API_URL}/api/restaurants`);
        if (response.ok) {
          const data = await response.json();
          let parsedRestaurants = [];

          if (data && data.length > 0) {
            parsedRestaurants = data.map(r => {
              let imgUrl = r.imageUrl;
              if (imgUrl) {
                if (!imgUrl.startsWith('http')) {
                  imgUrl = `${API_URL}${imgUrl}`;
                }
              } else {
                imgUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60';
              }

              return {
                id: r._id,
                name: r.name,
                image: imgUrl,
                rating: 4.5,
                deliveryTime: '30-45 min',
                deliveryFee: 2.99,
                minOrder: 15,
                categories: r.categories && r.categories.length > 0 ? r.categories : ['Fast Food'],
                address: r.address || 'Location not added yet'
              };
            });
          } else {
            // Fallback mock data if database is empty so the UI doesn't look broken
            parsedRestaurants = [
              {
                id: 'mock-1',
                name: 'Burger King',
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500&q=60',
                rating: 4.2,
                deliveryTime: '20-30 min',
                deliveryFee: 1.49,
                minOrder: 10,
                categories: ['Fast Food', 'Burgers'],
                address: '123 Burger King St, City'
              },
              {
                id: 'mock-2',
                name: 'Spice Symphony',
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=60',
                rating: 4.8,
                deliveryTime: '40-55 min',
                deliveryFee: 0,
                minOrder: 25,
                categories: ['Indian', 'Curry'],
                address: '456 Curry Ave, FoodTown'
              },
              {
                id: 'mock-3',
                name: 'Pizza Hut',
                image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=60',
                rating: 4.0,
                deliveryTime: '25-40 min',
                deliveryFee: 3.99,
                minOrder: 15,
                categories: ['Pizza', 'Italian'],
                address: '789 Pizza Blvd, NY'
              }
            ];
          }
          setDbRestaurants(parsedRestaurants);
        }
      } catch (error) {
        console.error('Error fetching active restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Filter Logic
  const filteredRestaurants = useMemo(() => {
    return dbRestaurants.filter((restaurant) => {
      // 1. Text Search Filter
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [searchQuery, dbRestaurants]);

  return (
    <div className="w-full text-left">
      {/* Search state bubbles down to HeroSection */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : 'Popular Restaurants'
            }
          </h2>
          <p className="text-sm text-gray-500 font-medium">{filteredRestaurants.length} places found</p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center text-orange-500">
            <Loader className="animate-spin h-10 w-10 border-2 border-transparent bg-orange-100 rounded-full p-2" />
          </div>
        ) : filteredRestaurants.length > 0 ? (
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
