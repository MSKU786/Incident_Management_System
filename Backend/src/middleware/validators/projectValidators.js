const {body, param, query, validationResult} = require('express-validator');

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

// Validate project ID parameter
const validateProjectId = [
  param('id')
    .isInt({min: 1})
    .withMessage('Project ID must be a positive integer'),
  handleValidationErrors,
];

// Create project validation
const validateCreateProject = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({min: 1, max: 80})
    .withMessage('Project name must be between 1 and 80 characters')
    .escape(),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({min: 1, max: 80})
    .withMessage('Location must be between 1 and 80 characters')
    .escape(),
  handleValidationErrors,
];

// Update project validation
const validateUpdateProject = [
  param('id')
    .isInt({min: 1})
    .withMessage('Project ID must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({min: 1, max: 80})
    .withMessage('Project name must be between 1 and 80 characters')
    .escape(),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty')
    .isLength({min: 1, max: 80})
    .withMessage('Location must be between 1 and 80 characters')
    .escape(),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({min: 1})
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({min: 1, max: 100})
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

module.exports = {
  validateProjectId,
  validateCreateProject,
  validateUpdateProject,
  validatePagination,
};
