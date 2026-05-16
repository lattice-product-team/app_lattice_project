/**
 * Decode a JWT token payload without verification.
 * Useful for extracting public information like email or name from a Google id_token.
 */
export declare function decodeJwt(token: string): any;
/**
 * Hashes a plaintext password using Bcrypt.
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Compares a plaintext password with a Bcrypt hash.
 */
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
/**
 * Generates a signed JWT token for a user.
 */
export declare function generateToken(payload: { userId: number; email: string }): string;
/**
 * Verifies and decodes a JWT token.
 */
export declare function verifyToken(token: string): any;
//# sourceMappingURL=auth.utils.d.ts.map
