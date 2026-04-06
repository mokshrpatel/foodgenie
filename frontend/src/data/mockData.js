export const mockRestaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 423,
    deliveryTime: "25-30 min",
    deliveryFee: 1.99,
    categories: ["Pizza", "Italian"],
    priceRange: "$$",
    isPromoted: true
  },
  {
    id: 2,
    name: "Sushi Sakura",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 812,
    deliveryTime: "40-50 min",
    deliveryFee: 3.99,
    categories: ["Asian", "Sushi", "Healthy"],
    priceRange: "$$$",
    isPromoted: false
  },
  {
    id: 3,
    name: "Burger Joint",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviews: 1205,
    deliveryTime: "15-25 min",
    deliveryFee: 0,
    categories: ["Burger", "American", "Fast Food"],
    priceRange: "$",
    isPromoted: false
  },
  {
    id: 4,
    name: "Green Bowl Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 356,
    deliveryTime: "20-30 min",
    deliveryFee: 2.49,
    categories: ["Healthy", "Vegan", "Salad"],
    priceRange: "$$",
    isPromoted: false
  },
  {
    id: 5,
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    reviews: 589,
    deliveryTime: "30-40 min",
    deliveryFee: 1.49,
    categories: ["Mexican", "Fast Food"],
    priceRange: "$",
    isPromoted: true
  },
  {
    id: 6,
    name: "Indian Spice Market",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 645,
    deliveryTime: "35-45 min",
    deliveryFee: 2.99,
    categories: ["Indian", "Asian"],
    priceRange: "$$",
    isPromoted: false
  }
];

export const mockCategories = [
  { id: 1, name: "All", icon: "🍽️" },
  { id: 2, name: "Pizza", icon: "🍕" },
  { id: 3, name: "Burger", icon: "🍔" },
  { id: 4, name: "Asian", icon: "🍜" },
  { id: 5, name: "Healthy", icon: "🥗" },
  { id: 6, name: "Mexican", icon: "🌮" },
];
