/**
 * Menu Management Module
 * Full CRUD for menu categories and menu items (food & beverage).
 * Integrates with /api/menu/* backend routes and HotelContext state.
 */

import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  MenuCategoryItem,
  MenuItem,
  MenuCategory
} from '../../types/index.ts';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  Search,
  Circle,
  X,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
  Tag,
  Clock,
  Flame,
  Leaf,
  Zap
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  BREAKFAST: Flame,
  LUNCH: Zap,
  DINNER: Zap,
  BEVERAGES: Circle,
  DESSERTS: Leaf,
  MINIBAR: Tag,
  SPA: Leaf,
  ROOM_SERVICE: UtensilsCrossed
};

const CATEGORY_COLORS: Record<string, string> = {
  BREAKFAST: 'bg-orange-50 text-orange-700 border-orange-100',
  LUNCH: 'bg-blue-50 text-blue-700 border-blue-100',
  DINNER: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  BEVERAGES: 'bg-teal-50 text-teal-700 border-teal-100',
  DESSERTS: 'bg-pink-50 text-pink-700 border-pink-100',
  MINIBAR: 'bg-purple-50 text-purple-700 border-purple-100',
  SPA: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  ROOM_SERVICE: 'bg-slate-50 text-slate-700 border-slate-100'
};

export const MenuManagement: React.FC = () => {
  const {
    menuCategories,
    menuItems,
    isLoading,
    createMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    isMenuCategoryModalOpen,
    setIsMenuCategoryModalOpen,
    isMenuItemModalOpen,
    setIsMenuItemModalOpen,
    editingMenuItem,
    setEditingMenuItem,
    addToast
  } = useHotel();

  const [view, setView] = useState<'CATEGORIES' | 'ITEMS'>('CATEGORIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const categoryNames = useMemo(() => menuCategories.map(c => c.name.toUpperCase()), [menuCategories]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleCreateItem = async (data: any) => {
    const ok = await createMenuItem(data);
    if (ok) setIsMenuItemModalOpen(false);
  };

  const handleUpdateItem = async (data: any) => {
    if (!editingMenuItem) return;
    const ok = await updateMenuItem(editingMenuItem.id, data);
    if (ok) setIsMenuItemModalOpen(false);
  };

  const handleDeleteItem = async (id: string) => {
    setDeletingItemId(null);
    await deleteMenuItem(id);
  };

  const handleDeleteCategory = async (id: string) => {
    setDeletingCatId(null);
    await deleteCategory(id);
  };

  const deleteCategory = async (id: string) => {
    const ok = await deleteMenuCategory(id);
    if (ok) setIsMenuCategoryModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        <p className="text-xs">Loading menu data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {view === 'CATEGORIES' ? 'Menu Categories' : 'Menu Items'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {view === 'CATEGORIES'
              ? 'Organize food & beverage offerings into categories.'
              : 'Manage individual menu items with pricing, availability, and inventory links.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {view === 'ITEMS' && (
            <button
              onClick={() => setView('CATEGORIES')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> Categories
            </button>
          )}
          {view === 'CATEGORIES' && (
            <button
              onClick={() => setView('ITEMS')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Circle className="w-3.5 h-3.5" /> Items
            </button>
          )}
          <button
            onClick={view === 'CATEGORIES' ? () => setIsMenuCategoryModalOpen(true) : () => { setEditingMenuItem(null); setIsMenuItemModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/25 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {view === 'CATEGORIES' ? 'Category' : 'Item'}</span>
          </button>
        </div>
      </div>

      {view === 'CATEGORIES' ? (
        // ================= CATEGORIES VIEW =================
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menuCategories.map(cat => {
            const itemCount = menuItems.filter(i => i.category === cat.name.toUpperCase() as MenuCategory).length;
            const Icon = CATEGORY_ICONS[cat.name.toUpperCase()] || UtensilsCrossed;
            const colorClass = CATEGORY_COLORS[cat.name.toUpperCase()] || 'bg-slate-50 text-slate-700 border-slate-100';
            const isDeleting = deletingCatId === cat.id;

            return (
              <div key={cat.id} className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setView('ITEMS'); setSelectedCategory(cat.name.toUpperCase() as MenuCategory); }}
                    title="View items in this category"
                    className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      // placeholder - edit handled via modal if needed
                    }}
                    className="ml-1 p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingCatId(cat.id)}
                    className="ml-1 p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mb-1 {colorClass}">
                      <Icon className="w-3 h-3" /> {cat.name}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{cat.description || 'No description'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Items</span>
                    <span className="font-semibold text-slate-800">{itemCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      cat.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {isDeleting && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-100">
                    <p className="text-xs text-rose-800 mb-2">Delete category '{cat.name}'?</p>
                    <p className="text-[10px] text-rose-600 mb-3">This will also remove any associated menu items.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeletingCatId(null)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {menuCategories.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
              <UtensilsCrossed className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No menu categories yet. Add your first category.</p>
            </div>
          )}
        </div>
      ) : (
        // ================= ITEMS VIEW =================
        <div className="space-y-4">
          {/* Search + Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu items by name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {menuCategories.map(cat => (
                <option key={cat.id} value={cat.name.toUpperCase()}>
                  {cat.name} ({menuItems.filter(i => i.category === cat.name.toUpperCase()).length})
                </option>
              ))}
            </select>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => {
              const Icon = CATEGORY_ICONS[item.category] || UtensilsCrossed;
              const colorClass = CATEGORY_COLORS[item.category] || 'bg-slate-50 text-slate-700 border-slate-100';
              const isDeleting = deletingItemId === item.id;

              return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingMenuItem(item); setIsMenuItemModalOpen(true); }}
                      className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingItemId(item.id)}
                      className="ml-1 p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mb-1 {colorClass}">
                        <Icon className="w-3 h-3" /> {item.category}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 font-mono">{item.currency} {item.price.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded ${
                        item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">Featured</span>
                      )}
                    </div>
                    {item.preparationTimeMinutes && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{item.preparationTimeMinutes} min</span>
                      </div>
                    )}
                    {item.linkedInventorySku && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <Tag className="w-3 h-3" />
                        <span>{item.linkedInventorySku}</span>
                      </div>
                    )}
                    {item.allergens?.length && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{item.allergens.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {isDeleting && (
                    <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-100">
                      <p className="text-xs text-rose-800 mb-2">Delete item '{item.name}'?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeletingItemId(null)}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                <Search className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No menu items found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CATEGORY MODAL ================= */}
      {isMenuCategoryModalOpen && (
        <MenuCategoryModal
          open={isMenuCategoryModalOpen}
          onClose={() => setIsMenuCategoryModalOpen(false)}
          onSave={async (data: any) => {
            const ok = await createMenuCategory(data);
            if (ok) setIsMenuCategoryModalOpen(false);
          }}
        />
      )}

      {/* ================= ITEM MODAL ================= */}
      {isMenuItemModalOpen && (
        <MenuItemModal
          open={isMenuItemModalOpen}
          onClose={() => setIsMenuItemModalOpen(false)}
          initialItem={editingMenuItem}
          categories={menuCategories}
          onSave={editingMenuItem ? handleUpdateItem : handleCreateItem}
        />
      )}
    </div>
  );
};

/**
 * Menu Category Create/Edit Modal
 */
interface MenuCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; isActive?: boolean; sortOrder?: number }) => Promise<void>;
}

function MenuCategoryModal({ open, onClose, onSave }: MenuCategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, description, isActive, sortOrder: Number(sortOrder) });
      setName('');
      setDescription('');
      setIsActive(true);
      setSortOrder(1);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-slate-200 w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Add Menu Category</h3>
          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Breakfast, Lunch, Dinner"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of this category"
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={e => setSortOrder(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Active
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Menu Item Create/Edit Modal
 */
interface MenuItemModalProps {
  open: boolean;
  onClose: () => void;
  initialItem: MenuItem | null;
  categories: MenuCategoryItem[];
  onSave: (data: any) => Promise<void>;
}

function MenuItemModal({ open, onClose, initialItem, categories, onSave }: MenuItemModalProps) {
  const isEdit = !!initialItem;
  const [form, setForm] = useState({
    category: initialItem?.category || 'BREAKFAST',
    name: initialItem?.name || '',
    description: initialItem?.description || '',
    price: initialItem?.price?.toString() || '',
    currency: initialItem?.currency || 'AED',
    isAvailable: initialItem?.isAvailable ?? true,
    isFeatured: initialItem?.isFeatured ?? false,
    imageUrl: initialItem?.imageUrl || '',
    linkedInventorySku: initialItem?.linkedInventorySku || '',
    inventoryDeductionQty: initialItem?.inventoryDeductionQty?.toString() || '',
    preparationTimeMinutes: initialItem?.preparationTimeMinutes?.toString() || '',
    allergens: (initialItem?.allergens || []).join(', '),
    tags: (initialItem?.tags || []).join(', ')
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        inventoryDeductionQty: form.inventoryDeductionQty ? Number(form.inventoryDeductionQty) : undefined,
        preparationTimeMinutes: form.preparationTimeMinutes ? Number(form.preparationTimeMinutes) : undefined,
        allergens: form.allergens.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean)
      };
      await onSave(data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-slate-200 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name.toUpperCase()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Item Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Price</label>
              <div className="flex items-center">
                <select
                  value={form.currency}
                  onChange={e => setForm({ ...form, currency: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-l-lg px-2 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option>AED</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="flex-1 bg-slate-50 border-l-0 border-r border-t border-b border-slate-200 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Available for order
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Featured item
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Prep Time (min)</label>
              <input
                type="number"
                value={form.preparationTimeMinutes}
                onChange={e => setForm({ ...form, preparationTimeMinutes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Inventory Deduction Qty</label>
              <input
                type="number"
                step="0.01"
                value={form.inventoryDeductionQty}
                onChange={e => setForm({ ...form, inventoryDeductionQty: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Linked Inventory SKU</label>
              <input
                type="text"
                value={form.linkedInventorySku}
                onChange={e => setForm({ ...form, linkedInventorySku: e.target.value })}
                placeholder="e.g. FB-001"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Allergens (comma-separated)</label>
              <input
                type="text"
                value={form.allergens}
                onChange={e => setForm({ ...form, allergens: e.target.value })}
                placeholder="e.g. GLUTEN, DAIRY, NUTS"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. Chef's Special, Vegetarian"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.name.trim() || !form.price || saving}
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
