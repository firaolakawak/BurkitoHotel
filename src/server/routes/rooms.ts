import { Router, Request, Response } from 'express';
import { db } from '../database.ts';
import { RoomStatus } from '../../types/index.ts';

const router = Router();

// GET /api/rooms - List all rooms with optional filtering
router.get('/', (req: Request, res: Response) => {
  try {
    const { floor, status, category } = req.query;
    let roomList = Array.from(db.rooms.values());

    if (floor) {
      roomList = roomList.filter(r => r.floor === Number(floor));
    }
    if (status) {
      roomList = roomList.filter(r => r.status === status);
    }
    if (category) {
      roomList = roomList.filter(r => r.category === category);
    }

    // Attach active booking and guest summary if occupied
    const enrichedRooms = roomList.map(room => {
      let booking = null;
      let guest = null;
      if (room.currentBookingId) {
        booking = db.bookings.get(room.currentBookingId) || null;
        if (booking) {
          guest = db.guests.get(booking.guestId) || null;
        }
      }
      const activeTicket = room.activeMaintenanceTicketId 
        ? db.maintenanceTickets.get(room.activeMaintenanceTicketId) || null 
        : null;

      return {
        ...room,
        currentBooking: booking ? { ...booking, guest } : null,
        activeMaintenanceTicket: activeTicket
      };
    });

    res.json({ success: true, count: enrichedRooms.length, data: enrichedRooms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/rooms - Create a new room
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      roomNumber,
      floor,
      category,
      pricePerNight,
      status,
      maxOccupancy,
      bedConfig,
      amenities
    } = req.body;

    if (!roomNumber || floor === undefined || !category || pricePerNight === undefined || !status || maxOccupancy === undefined || !bedConfig) {
      return res.status(400).json({ success: false, message: 'roomNumber, floor, category, pricePerNight, status, maxOccupancy, and bedConfig are required' });
    }

    const room = db.createRoom({
      roomNumber,
      floor: Number(floor),
      category,
      pricePerNight: Number(pricePerNight),
      status,
      maxOccupancy: Number(maxOccupancy),
      bedConfig,
      amenities: Array.isArray(amenities) ? amenities : []
    });

    res.status(201).json({ success: true, message: `Room ${room.roomNumber} created`, data: room });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/rooms/:id - Get specific room details
router.get('/:id', (req: Request, res: Response) => {
  const room = db.rooms.get(req.params.id);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  let booking = null;
  let guest = null;
  let folio = null;

  if (room.currentBookingId) {
    booking = db.bookings.get(room.currentBookingId) || null;
    if (booking) {
      guest = db.guests.get(booking.guestId) || null;
      folio = db.folios.get(booking.folioId) || null;
    }
  }

  const statusHistory = db.getRoomStatusHistory(req.params.id);

  res.json({
    success: true,
    data: {
      ...room,
      booking,
      guest,
      folio,
      statusHistory
    }
  });
});

// PUT /api/rooms/:id - Update room details (full replacement)
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { roomNumber, floor, category, pricePerNight, status, maxOccupancy, bedConfig, amenities } = req.body;

    const updated = db.updateRoom(req.params.id, {
      ...(roomNumber !== undefined && { roomNumber }),
      ...(floor !== undefined && { floor: Number(floor) }),
      ...(category !== undefined && { category }),
      ...(pricePerNight !== undefined && { pricePerNight: Number(pricePerNight) }),
      ...(status !== undefined && { status }),
      ...(maxOccupancy !== undefined && { maxOccupancy: Number(maxOccupancy) }),
      ...(bedConfig !== undefined && { bedConfig }),
      ...(amenities !== undefined && { amenities })
    });

    res.json({ success: true, message: `Room ${updated.roomNumber} updated`, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/rooms/:id - Partial update room details
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const { roomNumber, floor, category, pricePerNight, status, maxOccupancy, bedConfig, amenities } = req.body;

    const updated = db.updateRoom(req.params.id, {
      ...(roomNumber !== undefined && { roomNumber }),
      ...(floor !== undefined && { floor: Number(floor) }),
      ...(category !== undefined && { category }),
      ...(pricePerNight !== undefined && { pricePerNight: Number(pricePerNight) }),
      ...(status !== undefined && { status }),
      ...(maxOccupancy !== undefined && { maxOccupancy: Number(maxOccupancy) }),
      ...(bedConfig !== undefined && { bedConfig }),
      ...(amenities !== undefined && { amenities })
    });

    res.json({ success: true, message: `Room ${updated.roomNumber} updated`, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/rooms/:id/status - Update room operational status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body as { status: RoomStatus };
    const room = db.rooms.get(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const updated = db.updateRoom(req.params.id, { status });
    res.json({ success: true, message: `Room ${updated.roomNumber} status set to ${status}`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/rooms/:id - Delete a room (blocked if occupied or has active booking)
router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.deleteRoom(req.params.id);
    res.json({ success: true, message: 'Room deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/rooms/:id/status-history - Get room status change history
router.get('/:id/status-history', (req: Request, res: Response) => {
  try {
    const history = db.getRoomStatusHistory(req.params.id);
    res.json({ success: true, count: history.length, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
