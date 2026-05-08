import { Request, Response } from 'express';
/**
 * Get configuration for a specific event including direct branding
 */
export declare const getEventConfig: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const healthCheck: (req: Request, res: Response) => void;
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const claimTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const ticketSync: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTickets: (req: Request, res: Response) => Promise<void>;
export declare const updateMe: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: Request, res: Response) => Promise<void>;
export declare const unclaimTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Social Login: Google
 */
export declare const googleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Social Login: Apple
 */
export declare const appleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Passkey: Registration Challenge
 */
export declare const registerPasskeyChallenge: (req: Request, res: Response) => Promise<void>;
/**
 * Passkey: Registration Verification
 */
export declare const registerPasskeyVerify: (req: Request, res: Response) => Promise<void>;
/**
 * Passkey: Login Challenge
 */
export declare const loginPasskeyChallenge: (req: Request, res: Response) => Promise<void>;
/**
 * Passkey: Login Verification
 */
export declare const loginPasskeyVerify: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map