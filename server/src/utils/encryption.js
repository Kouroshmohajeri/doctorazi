import crypto from 'crypto';


const IV_LENGTH = 16; 
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export function encryptPayload(payload) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    const encryptedPayload = cipher.update(JSON.stringify(payload), 'utf8', 'hex') + cipher.final('hex');
    return iv.toString('hex') + ':' + encryptedPayload;
}

export function decryptPayload(encryptedPayload) {
    const [iv, encryptedData] = encryptedPayload.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
    const payload = JSON.parse(decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8'));
    return payload;
  }