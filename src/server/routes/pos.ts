import { Router, Request, Response } from 'express';
import { db } from '../database.ts';

const router = Router();

// GET /api/pos/products - Get POS catalog menu
router.get('/products', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.posProducts });
});

// POST /api/pos/charge-room - Post dining/spa/beverage charge directly to guest room
router.post('/charge-room', (req: Request, res: Response) => {
  try {
    const { roomNumber, category, description, amount, serverName } = req.body;

    if (!roomNumber) {
      return res.status(400).json({ success: false, message: 'Guest room number is required' });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid charge amount is required' });
    }

    const result = db.postPosCharge(
      roomNumber,
      category || 'FOOD_BEVERAGE',
      description || 'POS Terminal Charge',
      Number(amount),
      serverName || 'Main Dining Room'
    );

    res.json({
      success: true,
      message: `Charge of $${Number(amount).toFixed(2)} posted directly to Room ${roomNumber} folio!`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
