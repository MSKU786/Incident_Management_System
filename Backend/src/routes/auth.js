const express = require('express');
const authMiddlware = require('../middleware/auth');
const {
  register,
  login,
  logout,
  refreshToken,
} = require('../controllers/auth_controller');
const authLimiter = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} = require('../middleware/validators/authValidators');

const authRoutes = express.Router();

authRoutes.post('/register', authLimiter, validateRegister, register);
authRoutes.post('/login', authLimiter, validateLogin, login);
authRoutes.post('/logout', authMiddlware, logout);
authRoutes.post('/refresh-token', validateRefreshToken, refreshToken);

module.exports = {authRoutes};
