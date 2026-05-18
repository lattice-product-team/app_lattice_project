import { Request, Response } from 'express';
import { db, users, tickets, events, passkeyCredentials, eq, and, sql } from '@app/db';
import {
  decodeJwt,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from './auth.utils.js';

/**
 * Get configuration for a specific event including direct branding
 */
export const getEventConfig = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
    const eventResult = await db
      .select()
      .from(events)
      .where(eq(events.id, Number(eventId)))
      .limit(1);

    if (!eventResult.length) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventData = eventResult[0];

    res.json(eventData);
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
        const hashedPassword = await hashPassword(password);
        const updatedUser = await db
          .update(users)
          .set({
            passwordHash: hashedPassword,
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
          token: generateToken({ userId: user.id, email: user.email }),
        });
      }

      return res.status(400).json({
        error: {
          code: 'USER_EXISTS',
          message: 'User already exists',
          user_friendly_message: 'This email is already registered.',
          status: 400,
        },
      });
    }

    let hasTicket = false;
    if (ticket_code) {
      hasTicket = true;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash: hashedPassword,
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
      token: generateToken({ userId: newUser[0].id, email: newUser[0].email }),
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

    let isMatch = false;
    if (user) {
      isMatch = await comparePassword(password, user.passwordHash);

      // Lazy migration: if password matches as plaintext (legacy), hash it now
      if (!isMatch && user.passwordHash === password) {
        console.log(`[Auth] Lazy migrating user ${user.id} to Bcrypt`);
        const newHash = await hashPassword(password);
        await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
        isMatch = true;
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          user_friendly_message: 'Incorrect email or password.',
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
      token: generateToken({ userId: user.id, email: user.email }),
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
        user_friendly_message: 'Missing ticket QR code.',
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
          user_friendly_message: 'This ticket does not exist.',
          status: 404,
        },
      });
    }

    if (ticket.userId) {
      const decoded = authHeader?.startsWith('Bearer ')
        ? verifyToken(authHeader.substring(7))
        : null;
      if (decoded) {
        const userId = decoded.userId;

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
          user_friendly_message: 'This ticket is already associated with another user.',
          status: 400,
        },
      });
    }

    if (!ticket.isActive) {
      return res.status(400).json({
        error: {
          code: 'TICKET_INACTIVE',
          message: 'Ticket is inactive',
          user_friendly_message: 'This ticket is not active.',
          status: 400,
        },
      });
    }

    const decoded = authHeader?.startsWith('Bearer ') ? verifyToken(authHeader.substring(7)) : null;
    if (decoded) {
      const userId = decoded.userId;

      if (ticket.ownerEmail) {
        const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userResult[0];

        if (!user || user.email !== ticket.ownerEmail) {
          return res.status(403).json({
            error: {
              code: 'EMAIL_MISMATCH',
              message: 'This ticket belongs to another email address',
              user_friendly_message: 'This ticket belongs to another email address.',
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
          user_friendly_message: "Please log in or register to associate the ticket.",
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
        user_friendly_message: 'Missing QR code.',
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
        gate: 'Gate 3',
        zoneName: 'Grandstand G',
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
      token: generateToken({ userId: user.id, email: user.email }),
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
  const decoded = verifyToken(authHeader!.substring(7));
  const userId = decoded.userId;

  try {
    const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));
    res.json(userTickets);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const decoded = verifyToken(authHeader!.substring(7));
  const userId = decoded.userId;
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
  const decoded = verifyToken(authHeader!.substring(7));
  const userId = decoded.userId;

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
  const decoded = verifyToken(authHeader!.substring(7));
  const userId = decoded.userId;

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

/**
 * Social Login: Google
 */
export const googleLogin = async (req: Request, res: Response) => {
  const { token, ticket_code } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Google token is required' });
  }

  try {
    // TODO: Verify token with google-auth-library
    // const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
    // const payload = ticket.getPayload();

    // MOCK Verification for now - extraction from real token
    const decoded = decodeJwt(token);
    if (!decoded) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const email = decoded.email;
    const googleId = decoded.sub;
    const name = decoded.name || 'Google User';
    const avatarUrl = decoded.picture;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Google token missing required fields' });
    }

    const userResult = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
    let user = userResult[0];

    if (!user) {
      // Check if user exists with same email but different provider
      const emailUserResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      const emailUser = emailUserResult[0];

      if (emailUser) {
        // Link Google ID to existing email account
        const updatedUser = await db
          .update(users)
          .set({
            googleId: googleId,
            fullName: emailUser.fullName || name,
            avatarUrl: emailUser.avatarUrl || avatarUrl,
          })
          .where(eq(users.id, emailUser.id))
          .returning();
        user = updatedUser[0];
      } else {
        // Create new user
        const newUser = await db
          .insert(users)
          .values({
            email: email,
            googleId: googleId,
            fullName: name,
            avatarUrl: avatarUrl,
            passwordHash: 'social_login_no_password',
          })
          .returning();
        user = newUser[0];
      }
    }

    // Associate ticket if provided
    if (ticket_code) {
      await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticket_code));
      const updatedUser = await db
        .update(users)
        .set({ hasTicket: true })
        .where(eq(users.id, user.id))
        .returning();
      user = updatedUser[0];
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        hasTicket: user.hasTicket,
        avatarUrl: user.avatarUrl,
      },
      token: generateToken({ userId: user.id, email: user.email }),
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ error: String(error) });
  }
};

/**
 * Social Login: Apple
 */
export const appleLogin = async (req: Request, res: Response) => {
  const { token, fullName, ticket_code } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Apple token is required' });
  }

  try {
    // TODO: Verify token with apple-signin-verify

    // MOCK Verification for now - try to extract from token if it's a JWT
    const decoded = decodeJwt(token);
    const appleId = decoded?.sub || `apple_${token.substring(0, 10)}`;
    const email = decoded?.email || `apple_${token.substring(0, 8)}@example.com`;

    const userResult = await db.select().from(users).where(eq(users.appleId, appleId)).limit(1);
    let user = userResult[0];

    if (!user) {
      const newUser = await db
        .insert(users)
        .values({
          email: email,
          appleId: appleId,
          fullName: fullName
            ? `${fullName.firstName} ${fullName.lastName}`
            : decoded?.name || 'Apple User',
          passwordHash: 'social_login_no_password',
        })
        .returning();
      user = newUser[0];
    }

    // Associate ticket if provided
    if (ticket_code) {
      await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticket_code));
      const updatedUser = await db
        .update(users)
        .set({ hasTicket: true })
        .where(eq(users.id, user.id))
        .returning();
      user = updatedUser[0];
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        hasTicket: user.hasTicket,
        avatarUrl: user.avatarUrl,
      },
      token: generateToken({ userId: user.id, email: user.email }),
    });
  } catch (error) {
    console.error('Apple Login Error:', error);
    res.status(500).json({ error: String(error) });
  }
};

/**
 * Passkey: Registration Challenge
 */
export const registerPasskeyChallenge = async (req: Request, res: Response) => {
  // TODO: Use generateRegistrationOptions from @simplewebauthn/server
  res.json({
    challenge: 'mock_registration_challenge',
    rp: { name: 'Lattice', id: 'lattice.dev' },
    user: { id: 'user_123', name: 'user@example.com', displayName: 'User' },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
  });
};

/**
 * Passkey: Registration Verification
 */
export const registerPasskeyVerify = async (req: Request, res: Response) => {
  const { id, response } = req.body;
  const authHeader = req.headers.authorization;
  const decoded = verifyToken(authHeader!.substring(7));
  const userId = decoded.userId;

  try {
    await db.insert(passkeyCredentials).values({
      id,
      userId,
      publicKey: 'mock_public_key',
      counter: 0,
    });

    await db.update(users).set({ isPasskeyEnabled: true }).where(eq(users.id, userId));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

/**
 * Passkey: Login Challenge
 */
export const loginPasskeyChallenge = async (req: Request, res: Response) => {
  // TODO: Use generateAuthenticationOptions
  res.json({
    challenge: 'mock_login_challenge',
    allowCredentials: [], // Allow all registered for the RP
  });
};

/**
 * Passkey: Login Verification
 */
export const loginPasskeyVerify = async (req: Request, res: Response) => {
  const { id, response } = req.body;

  try {
    const credResult = await db
      .select()
      .from(passkeyCredentials)
      .where(eq(passkeyCredentials.id, id))
      .limit(1);
    const credential = credResult[0];

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, credential.userId))
      .limit(1);
    const user = userResult[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      token: generateToken({ userId: user.id, email: user.email }),
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};
