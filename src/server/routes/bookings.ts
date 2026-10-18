import { Router, Request, Response } from 'express';
import { db } from '../database.ts';
import { Booking, Guest, GuestFolio } from '../../types/index.ts';

const router = Router();

// GET /api/bookings - List bookings
router.get('/', (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let list = Array.from(db.bookings.values());
    if (status) {
      list = list.filter(b => b.status === status);
    }

    const populated = list.map(b => ({
      ...b,
      guest: db.guests.get(b.guestId),
      room: db.rooms.get(b.roomId),
      folio: db.folios.get(b.folioId)
    }));

    res.json({ success: true, count: populated.length, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings - Step-by-step Guest Registration & Room Booking Flow
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      guestData,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      autoCheckIn
    } = req.body;

    const room = db.rooms.get(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Specified room not found.' });
    }

    if (room.status === 'MAINTENANCE') {
      return res.status(400).json({ success: false, message: `Room ${room.roomNumber} is currently under maintenance.` });
    }

    if (room.status === 'OCCUPIED') {
      return res.status(400).json({ success: false, message: `Room ${room.roomNumber} is currently occupied.` });
    }

    // 1. Create or retrieve Guest record
    let guest: Guest | undefined = Array.from(db.guests.values()).find(
      g => g.email.toLowerCase() === guestData.email.toLowerCase() || g.idNumber === guestData.idNumber
    );

    if (!guest) {
      guest = {
        id: `g-${Date.now()}`,
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        email: guestData.email,
        phone: guestData.phone,
        idType: guestData.idType || 'PASSPORT',
        idNumber: guestData.idNumber,
        nationality: guestData.nationality || 'General',
        vipStatus: !!guestData.vipStatus,
        notes: guestData.notes,
        createdAt: new Date().toISOString()
      };
      db.guests.set(guest.id, guest);
    }

    // 2. Calculate nights and room charge
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalRoomCharge = room.pricePerNight * totalNights;
    const taxRate = 0.12; // 12% standard hospitality occupancy tax
    const taxAmount = Number((totalRoomCharge * taxRate).toFixed(2));

    const bookingId = `bk-${Date.now()}`;
    const folioId = `fol-${Date.now()}`;
    const bookingRef = `GH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create Folio with initial charges
    const folio: GuestFolio = {
      id: folioId,
      bookingId,
      status: 'OPEN',
      items: [
        {
          id: `fi-${Date.now()}-1`,
          folioId,
          category: 'ROOM_CHARGE',
          description: `Room ${room.roomNumber} (${room.category}) - ${totalNights} Night(s) @ $${room.pricePerNight}/night`,
          amount: totalRoomCharge,
          date: checkInDate,
          postedBy: 'FRONT_DESK_RESERVATION'
        },
        {
          id: `fi-${Date.now()}-2`,
          folioId,
          category: 'TAX',
          description: 'City Lodging & Hospitality Tax (12%)',
          amount: taxAmount,
          date: checkInDate,
          postedBy: 'SYSTEM'
        }
      ],
      payments: [],
      subtotal: totalRoomCharge,
      taxAmount,
      totalAmount: totalRoomCharge + taxAmount,
      paidAmount: 0,
      balanceDue: totalRoomCharge + taxAmount
    };
    db.folios.set(folioId, folio);

    // 4. Create Booking
    const booking: Booking = {
      id: bookingId,
      bookingReference: bookingRef,
      roomId: room.id,
      guestId: guest.id,
      checkInDate,
      checkOutDate,
      numberOfGuests: numberOfGuests || 1,
      ratePerNight: room.pricePerNight,
      totalNights,
      status: autoCheckIn ? 'CHECKED_IN' : 'CONFIRMED',
      specialRequests,
      folioId,
      createdAt: new Date().toISOString()
    };
    db.bookings.set(bookingId, booking);

    if (autoCheckIn) {
      db.checkInGuest(bookingId);
    }

    res.status(201).json({
      success: true,
      message: `Reservation ${bookingRef} created successfully!`,
      data: {
        booking: { ...booking, guest, room },
        folio
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings/:id/check-in - Check-in Guest & auto-deduct inventory
router.post('/:id/check-in', (req: Request, res: Response) => {
  try {
    const result = db.checkInGuest(req.params.id);
    res.json({
      success: true,
      message: `Guest successfully checked into Room ${result.room.roomNumber}. Inventory amenities deducted.`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/bookings/:id/check-out - Check-out Guest, settle folio, set room dirty
router.post('/:id/check-out', (req: Request, res: Response) => {
  try {
    const { paymentMethod } = req.body;
    const result = db.checkOutGuest(req.params.id, paymentMethod);
    res.json({
      success: true,
      message: `Check-out finalized for Room ${result.room.roomNumber}. Room routed to Housekeeping.`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/:id/folio - Get unified guest folio
router.get('/:id/folio', (req: Request, res: Response) => {
  try {
    const booking = db.bookings.get(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const folio = db.folios.get(booking.folioId);
    if (!folio) {
      return res.status(404).json({ success: false, message: 'Folio not found' });
    }

    const guest = db.guests.get(booking.guestId);
    const room = db.rooms.get(booking.roomId);

    res.json({
      success: true,
      data: {
        folio,
        booking,
        guest,
        room
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
