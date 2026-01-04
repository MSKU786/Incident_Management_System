const express = require('express');
const authMiddlware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createPost,
  getPostById,
  updateProject,
  deleteProject,
  getAllProjects,
} = require('../controllers/project_controller');
const {
  validateCreateProject,
  validateProjectId,
  validateUpdateProject,
  validatePagination,
} = require('../middleware/validators/projectValidators');
const projectRoutes = express.Router();

projectRoutes.post(
  '/',
  authMiddlware,
  authorize('admin', 'manager'),
  validateCreateProject,
  createPost
);

projectRoutes.get('/:id', authMiddlware, validateProjectId, getPostById);

projectRoutes.put(
  '/:id',
  authMiddlware,
  authorize('admin', 'manager'),
  validateUpdateProject,
  updateProject
);

projectRoutes.delete(
  '/:id',
  authMiddlware,
  authorize('admin', 'manager'),
  validateProjectId,
  deleteProject
);

projectRoutes.get(
  '/',
  authMiddlware,
  authorize('admin', 'manager'),
  validatePagination,
  getAllProjects
);

module.exports = {projectRoutes};
