import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Truck, Loader } from 'lucide-react';
import { API_URL } from '../../config';
import MenuItemCard from '../../components/customer/MenuItemCard';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          fetch(`${API_URL}/api/restaurants/${id}`),
          fetch(`${API_URL}/api/restaurants/${id}/menu`)
        ]);

        if (resResponse.ok && menuResponse.ok) {
          const resData = await resResponse.json();
          const menuData = await menuResponse.json();
          setRestaurant(resData);
          setMenuItems(menuData);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantAndMenu();

    // Polling exclusively for restaurant status changes (Open/Closed)
    const intervalId = setInterval(async () => {
      try {
        const resResponse = await fetch(`${API_URL}/api/restaurants/${id}`);
        if (resResponse.ok) {
          const resData = await resResponse.json();
          // Update only restaurant state seamlessly
          setRestaurant(resData);
        }
      } catch (error) {
        console.error('Error polling restaurant details:', error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-orange-500">
        <Loader className="animate-spin h-10 w-10 border-2 border-transparent bg-orange-100 rounded-full p-2" />
      </div>
    );
  }

  if (!restaurant) {
    return <div className="p-8 text-center">Restaurant not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">

      {/* Header Image */}
      <div className="h-64 md:h-80 w-full relative">
        <img
          src={restaurant.imageUrl ? `${API_URL}${restaurant.imageUrl}` : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            {restaurant.isOpen === false && (
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                Currently Closed
              </span>
            )}
          </div>
          {menuItems.filter(item => item.isFamous).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {menuItems.filter(item => item.isFamous).map(item => (
                <span key={item._id} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center shadow-sm">
                  <Star className="w-4 h-4 mr-1 text-yellow-600 fill-current" />
                  {item.name}
                </span>
              ))}
            </div>
          )}


        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Menu</h2>
          </div>
          {menuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <MenuItemCard key={item._id} item={item} restaurantId={restaurant._id} isOpen={restaurant.isOpen !== false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No menu items added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
