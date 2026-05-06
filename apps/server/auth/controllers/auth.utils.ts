/**
 * Decode a JWT token payload without verification.
 * Useful for extracting public information like email or name from a Google id_token.
 */
export function decodeJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}
