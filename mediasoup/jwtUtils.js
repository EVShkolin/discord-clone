import jwt from 'jsonwebtoken';

export const getDataFromToken = (token) => {
  const publicKey = [
    '-----BEGIN PUBLIC KEY-----',
    process.env.JWT_PUBLIC_KEY,
    '-----END PUBLIC KEY-----'
  ].join('\n');

  try {
    return jwt.verify(token, publicKey);
  } catch (err) {
    console.log(err);
  }
};