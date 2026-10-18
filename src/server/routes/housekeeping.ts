import { Router, Request, Response } from 'express';
import { db } from '../database.ts';
import { HousekeepingTask, MaintenanceTicket } from '../../types/index.ts';

const router = Router();

// GET /api/housekeeping/tasks
router.get('/tasks', (_req: Request, res: Response) => {
  res.json({ success: true, data: Array.from(db.housekeepingTasks.values()) });
});

// PATCH /api/housekeeping/tasks/:id - Update task status (e.g. mark room cleaned)
router.patch('/tasks/:id', (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const task = db.housekeepingTasks.get(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Housekeeping task not found' });
    }

    task.status = status;
    if (notes) task.notes = notes;
    task.updatedAt = new Date().toISOString();

    // If task is completed or inspected, update room status from DIRTY to AVAILABLE
    if (status === 'COMPLETED' || status === 'INSPECTED') {
      const room = db.rooms.get(task.roomId);
      if (room && room.status === 'DIRTY') {
        room.status = 'AVAILABLE';
      }
    }

    res.json({ success: true, message: `Task status updated to ${status}`, data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------------- MAINTENANCE TICKETS ----------------

// GET /api/housekeeping/maintenance
router.get('/maintenance', (_req: Request, res: Response) => {
  res.json({ success: true, data: Array.from(db.maintenanceTickets.values()) });
});

// POST /api/housekeeping/maintenance - Create maintenance ticket (locks room)
router.post('/maintenance', (req: Request, res: Response) => {
  try {
    const { roomId, category, description, priority, assignedTo, locksRoom } = req.body;
    const room = db.rooms.get(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const ticketId = `mt-${Date.now()}`;
    const ticketNumber = `MT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket: MaintenanceTicket = {
      id: ticketId,
      ticketNumber,
      roomId: room.id,
      roomNumber: room.roomNumber,
      category: category || 'GENERAL',
      description,
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      assignedTo: assignedTo || 'Duty Maintenance Staff',
      locksRoom: locksRoom !== false,
      createdAt: new Date().toISOString()
    };

    db.maintenanceTickets.set(ticketId, newTicket);

    // If locksRoom is true, lock the room into MAINTENANCE status
    if (newTicket.locksRoom) {
      room.status = 'MAINTENANCE';
      room.activeMaintenanceTicketId = ticketId;
    }

    res.status(201).json({
      success: true,
      message: `Maintenance Ticket ${ticketNumber} created. Room ${room.roomNumber} ${newTicket.locksRoom ? 'locked into MAINTENANCE' : 'noted'}.`,
      data: newTicket
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/housekeeping/maintenance/:id/resolve - Resolve maintenance ticket (unlocks room)
router.patch('/maintenance/:id/resolve', (req: Request, res: Response) => {
  try {
    const ticket = db.maintenanceTickets.get(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = 'RESOLVED';
    ticket.resolvedAt = new Date().toISOString();

    const room = db.rooms.get(ticket.roomId);
    if (room && room.status === 'MAINTENANCE') {
      room.status = 'AVAILABLE';
      room.activeMaintenanceTicketId = null;
    }

    res.json({
      success: true,
      message: `Ticket ${ticket.ticketNumber} resolved. Room ${room ? room.roomNumber : ''} released back to AVAILABLE.`,
      data: ticket
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
