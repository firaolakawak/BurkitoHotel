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

  res.json({
    success: true,
    data: {
      ...room,
      booking,
      guest,
      folio
    }
  });
});

// PATCH /api/rooms/:id/status - Update room operational status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body as { status: RoomStatus };
    const room = db.rooms.get(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room.status = status;
    res.json({ success: true, message: `Room ${room.roomNumber} status set to ${status}`, data: room });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
