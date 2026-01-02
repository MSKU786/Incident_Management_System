const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_EXPIRY = '15m';
const JWT_REFRESH_EXPIRY = '7d';

const generateToken = (user) => {
  try {
    const token = jwt.sign({sub: user.user_id, email: user.email}, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    const refreshToken = jwt.sign(
      {sub: user.user_id, email: user.email, type: 'refresh'},
      JWT_SECRET,
      {
        expiresIn: JWT_REFRESH_EXPIRY,
      }
    );

    return {token, refreshToken};
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  generateToken,
  JWT_SECRET,
  JWT_EXPIRY,
  JWT_REFRESH_EXPIRY,
};
