const express = require('express');
const authMiddlware = require('../middleware/auth');
const {
  register,
  login,
  logout,
  refreshToken,
} = require('../controllers/auth_controller');
const authLimiter = require('../middleware/rateLimiter');

const authRoutes = express.Router();

authRoutes.post('/register', authLimiter, register);
authRoutes.post('/login', authLimiter, login);
authRoutes.post('/logout', authMiddlware, logout);
authRoutes.post('/refresh-token', refreshToken);

module.exports = {authRoutes};
