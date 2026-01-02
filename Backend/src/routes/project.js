const express = require('express');
const authMiddlware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createProject,
  getPostById,
  updateProject,
  deleteProject,
  getAllProjects,
} = require('../controllers/project_controller');
const projectRoutes = express.Router();

projectRoutes.post(
  '/',
  authMiddlware,
  authorize('admin', 'manager'),
  createProject
);

projectRoutes.get('/:id', authMiddlware, getPostById);

projectRoutes.put(
  '/:id',
  authMiddlware,
  authorize('admin', 'manager'),
  updateProject
);

projectRoutes.delete(
  '/:id',
  authMiddlware,
  authorize('admin', 'manager'),
  deleteProject
);

projectRoutes.get(
  '/',
  authMiddlware,
  authorize('admin', 'manager'),
  getAllProjects
);

module.exports = {projectRoutes};
