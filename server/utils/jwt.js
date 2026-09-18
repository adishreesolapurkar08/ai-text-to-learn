import 'dotenv/config';
import jwt from 'jsonwebtoken';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in server/.env');
  }
  return secret;
};

export const signToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), email: user.email },
    getSecret(),
    { expiresIn: '7d' }
  );
