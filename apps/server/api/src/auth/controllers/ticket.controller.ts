import { db, tickets, users, events, passkeyCredentials, eq, sql } from '@app/db';
import { Request, Response } from 'express';
import { verifyToken, generateToken } from './auth.utils.js';

/**
 * Professional Ticket Management Controller
 */
export const getTickets = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const decoded = verifyToken(authHeader!.substring(7));
  const userId = decoded.userId;

  try {
    const userTickets = await db.select({
      id: tickets.id,
      code: tickets.code,
      zoneName: tickets.zoneName,
      gate: tickets.gate,
      seatRow: tickets.seatRow,
      seatNumber: tickets.seatNumber,
      isActive: tickets.isActive,
      createdAt: tickets.createdAt,
      seatLocation: sql<string>`ST_AsGeoJSON(${tickets.seatLocation})`,
      eventName: events.name,
      eventColor: events.primaryColor,
      eventBanner: events.bannerUrl,
    })
    .from(tickets)
    .innerJoin(events, eq(tickets.eventId, events.id))
    .where(eq(tickets.userId, userId));
    
    // Parse GeoJSON
    const parsedTickets = userTickets.map(t => ({
      ...t,
      seatLocation: t.seatLocation ? JSON.parse(t.seatLocation) : null
    }));

    res.json(parsedTickets);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const claimTicket = async (req: Request, res: Response) => {
  const { ticket_code } = req.body;
  const authHeader = req.headers.authorization;
  const decoded = verifyToken(authHeader!.substring(7));
  const userId = decoded.userId;

  try {
    const ticketResult = await db
      .select()
      .from(tickets)
      .where(eq(tickets.code, ticket_code))
      .limit(1);

    const ticket = ticketResult[0];

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.userId && ticket.userId !== userId) {
      return res.status(403).json({ error: 'Ticket already claimed by another user' });
    }

    await db.update(tickets).set({ userId }).where(eq(tickets.code, ticket_code));
    
    const updatedTicket = await db.select({
      id: tickets.id,
      code: tickets.code,
      zoneName: tickets.zoneName,
      gate: tickets.gate,
      seatRow: tickets.seatRow,
      seatNumber: tickets.seatNumber,
      isActive: tickets.isActive,
      seatLocation: sql<string>`ST_AsGeoJSON(${tickets.seatLocation})`,
      eventName: events.name,
      eventColor: events.primaryColor,
      eventBanner: events.bannerUrl,
    })
    .from(tickets)
    .innerJoin(events, eq(tickets.eventId, events.id))
    .where(eq(tickets.code, ticket_code));

    res.json({ 
      success: true, 
      ticket_info: {
        ...updatedTicket[0],
        seatLocation: updatedTicket[0].seatLocation ? JSON.parse(updatedTicket[0].seatLocation) : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};
