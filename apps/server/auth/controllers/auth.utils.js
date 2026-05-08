import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loadConfig } from '@app/core';
const config = loadConfig();
/**
 * Decode a JWT token payload without verification.
 * Useful for extracting public information like email or name from a Google id_token.
 */
export function decodeJwt(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        const payload = parts[1];
        const decoded = Buffer.from(payload, 'base64').toString('utf8');
        return JSON.parse(decoded);
    }
    catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
/**
 * Hashes a plaintext password using Bcrypt.
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
    return bcrypt.hash(password, salt);
}
/**
 * Compares a plaintext password with a Bcrypt hash.
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
/**
 * Generates a signed JWT token for a user.
 */
export function generateToken(payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '24h',
    });
}
/**
 * Verifies and decodes a JWT token.
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    }
    catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
}
