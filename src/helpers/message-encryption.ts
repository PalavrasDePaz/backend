import { ENCRYPTION_KEY } from '@src/config/server';
import crypto from 'crypto';

export const encrypt = (data: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(
    'hex'
  );
};

export const decrypt = (data: string) => {
  const binaryData = Buffer.from(data, 'hex');
  const iv = binaryData.subarray(-16);
  const encryptedData = binaryData.subarray(0, binaryData.length - 16);
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  return Buffer.concat([
    decipher.update(encryptedData),
    decipher.final()
  ]).toString();
};
