import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, FileText, DollarSign, Loader, Image as ImageIcon, Upload, Star } from 'lucide-react';
import { API_URL } from '../../config';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    isFamous: false
  });
  
  const token = localStorage.getItem('token');
  const API_ENDPOINT = `${API_URL}/api/menu`;

  const fetchItems = async () => {
    try {
      const response = await fetch(API_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formUpload = new FormData();
    formUpload.append('image', file);

    try {
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formUpload,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { imageUrl } = await uploadRes.json();
      
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ name: '', description: '', price: '', imageUrl: '', isFamous: false });
        fetchItems();
      } else {
        const data = await response.json();
        alert(data.message || 'Error adding item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl || '',
      isFamous: item.isFamous || false
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', description: '', price: '', imageUrl: '', isFamous: false });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        cancelEdit();
        fetchItems();
      } else {
        alert('Error updating item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchItems();
      } else {
        alert('Error deleting item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleFamous = async (item) => {
    // Optimistic UI update
    setItems(items.map(i => i._id === item._id ? { ...i, isFamous: !i.isFamous } : i));
    
    try {
      const response = await fetch(`${API_ENDPOINT}/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...item, isFamous: !item.isFamous })
      });
      
      if (response.ok) {
        // Refetch to ensure sync
        fetchItems();
      } else {
        // Revert optimistic update on failure
        fetchItems();
        alert('Error toggling famous status');
      }
    } catch (error) {
      console.error('Error toggling famous status:', error);
      // Revert optimistic update on error
      fetchItems();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              {isEditing ? <Edit2 className="mr-2 h-5 w-5 text-orange-500" /> : <Plus className="mr-2 h-5 w-5 text-orange-500" />}
              {isEditing ? 'Edit Item' : 'Add New Item'}
            </h3>
            
            <form onSubmit={isEditing ? handleUpdateItem : handleAddItem} className="space-y-4">
              
              <div className="flex justify-center mb-4">
                <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-orange-200 w-full h-32 flex flex-col items-center justify-center transition-colors hover:bg-orange-50">
                  {formData.imageUrl ? (
                    <img src={`${API_URL}${formData.imageUrl}`} alt="Item Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-orange-300" />
                      <span className="mt-2 block text-xs font-semibold text-orange-600">Item Image</span>
                    </div>
                  )}
                  <label className="absolute inset-0 w-full h-full cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-sm font-bold flex-col">
                    {uploadingImage ? <Loader className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6 mb-1" />}
                    {uploadingImage ? 'Uploading...' : 'Change Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                    placeholder="e.g. Margherita Pizza"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                    placeholder="Describe the ingredients and flavors..."
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                    placeholder="12.99"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center"
                >
                  {submitting ? <Loader className="animate-spin h-5 w-5" /> : (isEditing ? 'Update Item' : 'Add Item')}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left">
             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
               <h3 className="text-lg font-bold text-gray-900">Your Current Menu</h3>
             </div>
             
             {loading ? (
               <div className="p-10 flex justify-center text-orange-500">
                 <Loader className="animate-spin h-8 w-8" />
               </div>
             ) : items.length === 0 ? (
               <div className="p-10 text-center text-gray-500">
                 <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                   <Tag className="h-8 w-8 text-gray-400" />
                 </div>
                 <p className="text-lg font-medium text-gray-700">No items on your menu yet.</p>
                 <p className="text-sm mt-1">Use the form to add your first delicious item!</p>
               </div>
             ) : (
               <div className="divide-y divide-gray-100">
                 {items.map(item => (
                   <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-orange-50/30 transition-colors">
                     
                     <div className="flex items-center gap-4 flex-1">
                       {/* Menu Image */}
                       <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                         {item.imageUrl ? (
                            <img src={`${API_URL}${item.imageUrl}`} alt={item.name} className="h-full w-full object-cover" />
                         ) : (
                            <ImageIcon className="h-8 w-8 text-gray-300" />
                         )}
                       </div>
                       
                       <div>
                         <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                         <p className="text-sm text-gray-500 mt-1 mr-4">{item.description}</p>
                       </div>
                     </div>

                     <div className="flex items-center gap-6 mt-4 sm:mt-0">
                       <span className="text-xl font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                         ${Number(item.price).toFixed(2)}
                       </span>
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={() => handleToggleFamous(item)}
                           className={`p-2 rounded-lg transition-colors ${item.isFamous ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                           title={item.isFamous ? "Remove from Famous Dishes" : "Mark as Famous Dish"}
                         >
                           <Star className={`h-5 w-5 ${item.isFamous ? 'fill-current' : ''}`} />
                         </button>
                         <button 
                           onClick={() => startEdit(item)}
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                           title="Edit Item"
                         >
                           <Edit2 className="h-5 w-5" />
                         </button>
                         <button 
                           onClick={() => handleDeleteItem(item._id)}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                           title="Delete Item"
                         >
                           <Trash2 className="h-5 w-5" />
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
