import { Router, Request, Response } from 'express';
import { db } from '../database.ts';
import { MenuCategory, MenuCategoryItem, MenuItem } from '../../types/index.ts';

const router = Router();

// ================= MENU CATEGORIES =================

// GET /api/menu/categories - List all menu categories
router.get('/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getMenuCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/menu/categories - Create a new menu category
router.post('/categories', (req: Request, res: Response) => {
  try {
    const { name, description, isActive, sortOrder } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = db.createMenuCategory({ name, description, isActive, sortOrder });
    res.status(201).json({ success: true, message: `Menu category '${category.name}' created`, data: category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/menu/categories/:id - Update a menu category
router.patch('/categories/:id', (req: Request, res: Response) => {
  try {
    const { name, description, isActive, sortOrder } = req.body;
    const updated = db.updateMenuCategory(req.params.id, { name, description, isActive, sortOrder });
    res.json({ success: true, message: `Menu category '${updated.name}' updated`, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/menu/categories/:id - Delete a menu category
router.delete('/categories/:id', (req: Request, res: Response) => {
  try {
    db.deleteMenuCategory(req.params.id);
    res.json({ success: true, message: 'Menu category deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ================= MENU ITEMS =================

// GET /api/menu/items - List menu items (optional category/available filter)
router.get('/items', (req: Request, res: Response) => {
  try {
    const { category, availableOnly } = req.query;
    const items = db.getMenuItems({
      category: category as MenuCategory,
      availableOnly: availableOnly === 'true'
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/menu/items - Create a new menu item
router.post('/items', (req: Request, res: Response) => {
  try {
    const {
      category,
      name,
      description,
      price,
      currency,
      isAvailable,
      isFeatured,
      imageUrl,
      linkedInventorySku,
      inventoryDeductionQty,
      preparationTimeMinutes,
      allergens,
      tags
    } = req.body;

    if (!category || !name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Category, name, and price are required' });
    }

    const item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> = {
      category: category as MenuCategory,
      name,
      description: description || '',
      price: Number(price),
      currency: currency || 'AED',
      isAvailable: isAvailable !== false,
      isFeatured: isFeatured === true,
      imageUrl: imageUrl || undefined,
      linkedInventorySku: linkedInventorySku || undefined,
      inventoryDeductionQty: inventoryDeductionQty ? Number(inventoryDeductionQty) : undefined,
      preparationTimeMinutes: preparationTimeMinutes ? Number(preparationTimeMinutes) : undefined,
      allergens: Array.isArray(allergens) ? allergens : [],
      tags: Array.isArray(tags) ? tags : []
    };

    const created = db.createMenuItem(item);
    res.status(201).json({ success: true, message: `Menu item '${created.name}' created`, data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/menu/items/:id - Update a menu item
router.patch('/items/:id', (req: Request, res: Response) => {
  try {
    const {
      category,
      name,
      description,
      price,
      currency,
      isAvailable,
      isFeatured,
      imageUrl,
      linkedInventorySku,
      inventoryDeductionQty,
      preparationTimeMinutes,
      allergens,
      tags
    } = req.body;

    const updates: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>> = {};
    if (category !== undefined) updates.category = category as MenuCategory;
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (currency !== undefined) updates.currency = currency;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl || undefined;
    if (linkedInventorySku !== undefined) updates.linkedInventorySku = linkedInventorySku || undefined;
    if (inventoryDeductionQty !== undefined) updates.inventoryDeductionQty = Number(inventoryDeductionQty);
    if (preparationTimeMinutes !== undefined) updates.preparationTimeMinutes = Number(preparationTimeMinutes);
    if (allergens !== undefined) updates.allergens = Array.isArray(allergens) ? allergens : [];
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [];

    const updated = db.updateMenuItem(req.params.id, updates);
    res.json({ success: true, message: `Menu item '${updated.name}' updated`, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/menu/items/:id - Delete a menu item
router.delete('/items/:id', (req: Request, res: Response) => {
  try {
    db.deleteMenuItem(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
