import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
}

export const getDataFromToken = (token:string): TokenPayload | null => {
  const pubKey = process.env.JWT_PUBLIC_KEY;
  if (!pubKey) throw new Error('Public key is not defined');

  const publicKey = ['-----BEGIN PUBLIC KEY-----', pubKey, '-----END PUBLIC KEY-----'].join('\n');

  try {
    return jwt.verify(token, publicKey) as TokenPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
