import { Request, Response } from 'express';
import { db, users, tickets, venues, events, eq, and, sql } from '@app/db';

/**
 * Get configuration for a specific event including venue branding
 */
export const getEventConfig = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
    const eventResult = await db.select()
      .from(events)
      .where(eq(events.id, Number(eventId)))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .limit(1);

    if (!eventResult.length) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { events: eventData, venues: venueData } = eventResult[0];

    res.json({
      ...eventData,
      venue: venueData
    });
  } catch (err) {
    console.error('Error fetching event config:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'auth_service_ok', timestamp: new Date() });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, fullName, ticket_code } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Email and password are required',
        status: 400,
      },
    });
  }

  try {
    const existingResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const existingUser = existingResult[0];

    if (existingUser) {
      if (existingUser.passwordHash === 'auto_generated_pass') {
        const updatedUser = await db
          .update(users)
          .set({
            passwordHash: password,
            fullName: fullName || existingUser.fullName,
            hasTicket: ticket_code ? true : existingUser.hasTicket,
          })
          .where(eq(users.id, existingUser.id))
          .returning();

        const user = updatedUser[0];

        if (ticket_code) {
          await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticket_code));
        }

        return res.status(200).json({
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            hasTicket: user.hasTicket,
          },
          token: `mock_jwt_token_for_${user.id}`,
        });
      }

      return res.status(400).json({
        error: {
          code: 'USER_EXISTS',
          message: 'User already exists',
          user_friendly_message: 'Aquest correu ja està registrat.',
          status: 400,
        },
      });
    }

    let hasTicket = false;
    if (ticket_code) {
      hasTicket = true;
    }

    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash: password,
        fullName: fullName || email.split('@')[0],
        hasTicket,
      })
      .returning();

    if (ticket_code) {
      await db.update(tickets).set({ userId: newUser[0].id }).where(eq(tickets.code, ticket_code));
    }

    const userTickets = await db.select().from(tickets).where(eq(tickets.userId, newUser[0].id));

    res.status(201).json({
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        fullName: newUser[0].fullName,
        hasTicket: newUser[0].hasTicket,
      },
      token: `mock_jwt_token_for_${newUser[0].id}`,
      tickets: userTickets,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: String(error) });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, ticket_code } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Email and password are required',
        status: 400,
      },
    });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          user_friendly_message: 'Correu o contrasenya incorrectes.',
          status: 401,
        },
      });
    }

    let hasTicket = user.hasTicket;

    if (ticket_code) {
      await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticket_code));
      await db.update(users).set({ hasTicket: true }).where(eq(users.id, user.id));
      hasTicket = true;
    }

    const userTickets = await db.select().from(tickets).where(eq(tickets.userId, user.id));

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        hasTicket,
      },
      token: `mock_jwt_token_for_${user.id}`,
      tickets: userTickets,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: String(error) });
  }
};

export const claimTicket = async (req: Request, res: Response) => {
  const { ticket_code } = req.body;
  const authHeader = req.headers.authorization;

  if (!ticket_code) {
    return res.status(400).json({
      error: {
        code: 'MISSING_QR',
        message: 'Ticket code is required',
        user_friendly_message: 'Falta el codi QR del ticket.',
        status: 400,
      },
    });
  }

  let finalCode = ticket_code;
  try {
    const parsed = JSON.parse(ticket_code);
    if (parsed.code) finalCode = parsed.code;
  } catch {
    /* ignore */
  }

  try {
    const ticketResult = await db
      .select()
      .from(tickets)
      .where(eq(tickets.code, finalCode))
      .limit(1);
    const ticket = ticketResult[0];

    if (!ticket) {
      return res.status(404).json({
        error: {
          code: 'TICKET_NOT_FOUND',
          message: 'Ticket not found',
          user_friendly_message: 'Aquesta entrada no existeix.',
          status: 404,
        },
      });
    }

    if (ticket.userId) {
      if (authHeader && authHeader.startsWith('Bearer mock_jwt_token_for_')) {
        const userIdStr = authHeader.replace('Bearer mock_jwt_token_for_', '');
        const userId = parseInt(userIdStr, 10);

        if (ticket.userId === userId) {
          const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));
          return res.json({
            success: true,
            message: 'Ticket already associated with your account',
            ticket_info: ticket,
            tickets: userTickets,
          });
        }
      }

      return res.status(400).json({
        error: {
          code: 'TICKET_ALREADY_CLAIMED',
          message: 'Ticket is already claimed by another user',
          user_friendly_message: 'Aquesta entrada ja està associada a un altre usuari.',
          status: 400,
        },
      });
    }

    if (!ticket.isActive) {
      return res.status(400).json({
        error: {
          code: 'TICKET_INACTIVE',
          message: 'Ticket is inactive',
          user_friendly_message: 'Aquesta entrada no està activa.',
          status: 400,
        },
      });
    }

    if (authHeader && authHeader.startsWith('Bearer mock_jwt_token_for_')) {
      const userIdStr = authHeader.replace('Bearer mock_jwt_token_for_', '');
      const userId = parseInt(userIdStr, 10);

      if (ticket.ownerEmail) {
        const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userResult[0];

        if (!user || user.email !== ticket.ownerEmail) {
          return res.status(403).json({
            error: {
              code: 'EMAIL_MISMATCH',
              message: 'This ticket belongs to another email address',
              user_friendly_message: 'Aquesta entrada pertany a un altre correu electrònic.',
              status: 403,
            },
          });
        }
      }

      await db.update(tickets).set({ userId }).where(eq(tickets.code, finalCode));
      await db.update(users).set({ hasTicket: true }).where(eq(users.id, userId));

      const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));

      return res.json({
        success: true,
        message: 'Ticket claimed successfully',
        ticket_info: { ...ticket, userId },
        tickets: userTickets,
      });
    } else {
      return res.status(400).json({
        error: {
          code: 'REQUIRES_ACCOUNT',
          message: 'You must be logged in to claim this ticket',
          user_friendly_message: "Si us plau, inicia sessió o registra't per associar l'entrada.",
          status: 400,
        },
      });
    }
  } catch (error) {
    console.error('Ticket Claim Error:', error);
    res.status(500).json({ error: String(error) });
  }
};

export const ticketSync = async (req: Request, res: Response) => {
  const { qr_code_data } = req.body;

  if (!qr_code_data) {
    return res.status(400).json({
      error: {
        code: 'MISSING_QR',
        message: 'QR code data is required',
        user_friendly_message: 'Falta el codi QR.',
        status: 400,
      },
    });
  }

  try {
    let ticketCode = qr_code_data;
    let email = `guest_${Math.random().toString(36).substring(7)}@example.com`;

    try {
      const parsedData = JSON.parse(qr_code_data);
      if (parsedData.code && parsedData.email) {
        ticketCode = parsedData.code;
        email = parsedData.email;
      }
    } catch (e) {
      /* ignore */
    }

    if (ticketCode === 'INVALID_TICKET') {
      return res.status(400).json({
        error: {
          code: 'TICKET_INVALID',
          message: 'The QR code implies a generic entry, please select zone manually.',
          status: 400,
        },
      });
    }

    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let user = userResult[0];

    if (!user) {
      const insertedUser = await db
        .insert(users)
        .values({
          email,
          passwordHash: 'auto_generated_pass',
          fullName: email.split('@')[0],
          hasTicket: true,
        })
        .returning();
      user = insertedUser[0];
    } else {
      await db.update(users).set({ hasTicket: true }).where(eq(users.id, user.id));
      user.hasTicket = true;
    }

    const existingTicket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.code, ticketCode))
      .limit(1);
    let ticketInfo;

    if (existingTicket.length > 0) {
      await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticketCode));
      ticketInfo = existingTicket[0];
    } else {
      ticketInfo = {
        gate: 'Porta 3',
        zoneName: 'Tribuna G',
        seatRow: '12',
        seatNumber: '4',
        seatLocation: [2.2645, 41.5701],
      };
    }

    const userTickets = await db.select().from(tickets).where(eq(tickets.userId, user.id));

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        hasTicket: user.hasTicket,
      },
      token: `mock_jwt_token_for_${user.id}`,
      ticket_info: ticketInfo,
      tickets: userTickets,
      requires_setup: user.passwordHash === 'auto_generated_pass',
    });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: String(error),
        status: 500,
      },
    });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const userIdStr = authHeader!.replace('Bearer mock_jwt_token_for_', '');
  const userId = parseInt(userIdStr, 10);

  try {
    const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));
    res.json(userTickets);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const userIdStr = authHeader!.replace('Bearer mock_jwt_token_for_', '');
  const userId = parseInt(userIdStr, 10);
  const { avoidStairs, avoidCrowds, avoidSlopes, avoidGrandstands, fullName } = req.body;

  try {
    const updatedUser = await db
      .update(users)
      .set({
        avoidStairs: avoidStairs !== undefined ? avoidStairs : undefined,
        avoidCrowds: avoidCrowds !== undefined ? avoidCrowds : undefined,
        avoidSlopes: avoidSlopes !== undefined ? avoidSlopes : undefined,
        avoidGrandstands: avoidGrandstands !== undefined ? avoidGrandstands : undefined,
        fullName: fullName || undefined,
      })
      .where(eq(users.id, userId))
      .returning();

    const { passwordHash: _passwordHash, ...safeUser } = updatedUser[0];
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const userIdStr = authHeader!.replace('Bearer mock_jwt_token_for_', '');
  const userId = parseInt(userIdStr, 10);

  try {
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userResult.length > 0) {
      const { passwordHash: _passwordHash, ...safeUser } = userResult[0];
      res.json(safeUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const unclaimTicket = async (req: Request, res: Response) => {
  const { ticket_code } = req.body;
  const authHeader = req.headers.authorization;
  const userId = parseInt(authHeader!.replace('Bearer mock_jwt_token_for_', ''), 10);

  let finalCode = ticket_code;
  try {
    const parsed = JSON.parse(ticket_code);
    if (parsed.code) finalCode = parsed.code;
  } catch {
    /* ignore */
  }

  try {
    const ticketResult = await db
      .select()
      .from(tickets)
      .where(eq(tickets.code, finalCode))
      .limit(1);
    const ticket = ticketResult[0];

    if (!ticket) {
      const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));
      return res.json({
        success: true,
        message: 'Ticket removed (not found in DB)',
        tickets: userTickets,
      });
    }

    if (ticket.userId === null) {
      const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));
      return res.json({
        success: true,
        message: 'Ticket already removed',
        tickets: userTickets,
      });
    }

    if (Number(ticket.userId) !== Number(userId)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not own this ticket',
          status: 403,
        },
      });
    }

    await db.update(tickets).set({ userId: null }).where(eq(tickets.code, finalCode));
    const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));

    if (userTickets.length === 0) {
      await db.update(users).set({ hasTicket: false }).where(eq(users.id, userId));
    }

    return res.json({
      success: true,
      message: 'Ticket removed successfully',
      tickets: userTickets,
    });
  } catch (error) {
    console.error('Unclaim Error:', error);
    res.status(500).json({ error: String(error) });
  }
};
