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

// Validate incident ID parameter
const validateIncidentId = [
  param('id')
    .isInt({min: 1})
    .withMessage('Incident ID must be a positive integer'),
  handleValidationErrors,
];

// Create incident validation
const validateCreateIncident = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({min: 1, max: 80})
    .withMessage('Title must be between 1 and 80 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({max: 5000})
    .withMessage('Description must be less than 5000 characters')
    .escape(),
  body('project_id')
    .isInt({min: 1})
    .withMessage('Project ID must be a positive integer'),
  body('severity')
    .optional()
    .isIn(['low', 'moderate', 'high'])
    .withMessage('Severity must be low, moderate, or high'),
  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed'),
  handleValidationErrors,
];

// Update incident validation
const validateUpdateIncident = [
  param('id')
    .isInt({min: 1})
    .withMessage('Incident ID must be a positive integer'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({min: 1, max: 80})
    .withMessage('Title must be between 1 and 80 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({max: 5000})
    .withMessage('Description must be less than 5000 characters')
    .escape(),
  body('project_id')
    .optional()
    .isInt({min: 1})
    .withMessage('Project ID must be a positive integer'),
  body('severity')
    .optional()
    .isIn(['low', 'moderate', 'high'])
    .withMessage('Severity must be low, moderate, or high'),
  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed'),
  handleValidationErrors,
];

// Query parameters validation for getIncidents
const validateIncidentQuery = [
  query('project_id')
    .optional()
    .isInt({min: 1})
    .withMessage('Project ID must be a positive integer'),
  query('severity')
    .optional()
    .isIn(['low', 'moderate', 'high'])
    .withMessage('Severity must be low, moderate, or high'),
  query('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed'),
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
  validateIncidentId,
  validateCreateIncident,
  validateUpdateIncident,
  validateIncidentQuery,
};
