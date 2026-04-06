import React from 'react';

const CategoryFilters = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex overflow-x-auto hide-scrollbar space-x-4 py-4 mb-6 text-left">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.name)}
          className={`
            flex flex-shrink-0 items-center space-x-2 px-5 py-3 rounded-full whitespace-nowrap font-medium transition-all
            ${selectedCategory === category.name 
              ? 'bg-orange-600 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'}
          `}
        >
          <span className="text-xl">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
