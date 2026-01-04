const {body, validationResult} = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      errorMessages[error.path] = error.msg;
    });
    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  next();
};

// Register validation rules
const validateRegister = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number')
    .escape(),
  body('name')
    .optional()
    .trim()
    .isLength({min: 1, max: 80})
    .withMessage('Name must be between 1 and 80 characters')
    .escape(),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'reporter'])
    .withMessage('Role must be admin, manager, or reporter'),
  handleValidationErrors,
];

// Login validation rules
const validateLogin = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Refresh token validation
const validateRefreshToken = [
  body('refreshToken')
    .optional()
    .notEmpty()
    .withMessage('Refresh token cannot be empty'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRefreshToken,
};
