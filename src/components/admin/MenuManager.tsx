import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { MenuItem, MealCategory } from '../../types';

export const MenuManager: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } =
    useApp();

  const [selectedCategory, setSelectedCategory] = useState<MealCategory | 'all'>('breakfast');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'breakfast' as MealCategory,
    description: '',
    price: 0,
    calories: 200,
    dietary: 'veg' as 'veg' | 'non-veg' | 'vegan',
    imageEmoji: '🍲',
    isAvailable: true,
  });

  const filteredItems = menuItems.filter((i) => {
    if (selectedCategory !== 'all' && i.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'breakfast',
      description: '',
      price: 0,
      calories: 200,
      dietary: 'veg',
      imageEmoji: '🍲',
      isAvailable: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      calories: item.calories,
      dietary: item.dietary,
      imageEmoji: item.imageEmoji,
      isAvailable: item.isAvailable,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        ...formData,
      });
    } else {
      addMenuItem(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Mess Menu Management</h2>
          <p className="text-xs text-slate-500">
            Configure daily breakfast items, extra pricing, and live kitchen availability
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Menu Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['breakfast', 'lunch', 'dinner', 'snacks', 'all'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
              item.isAvailable
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{item.imageEmoji}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          item.dietary === 'veg'
                            ? 'bg-green-100 text-green-800'
                            : item.dietary === 'vegan'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.dietary}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.calories} kcal
                      </span>
                    </div>
                  </div>
                </div>

                <span className="font-mono font-bold text-xs text-slate-900">
                  {item.price > 0 ? `₹${item.price}` : 'Plan Free'}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              {/* Availability Toggle */}
              <button
                type="button"
                onClick={() => toggleItemAvailability(item.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  item.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {item.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" /> Out of Stock
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMenuItem(item.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    required
                    value={formData.imageEmoji}
                    onChange={(e) => setFormData({ ...formData, imageEmoji: e.target.value })}
                    className="w-full text-center text-xl py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masala Poha"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as MealCategory })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dietary Tag</label>
                  <select
                    value={formData.dietary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dietary: e.target.value as 'veg' | 'non-veg' | 'vegan',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Price (₹, 0 for plan-free)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Calories</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, preparation notes, accompaniments..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Update Dish' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
