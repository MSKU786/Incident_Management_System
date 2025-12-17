const express = require('express');

const authMiddlware = require('../middleware/auth');
const upload = require('../middleware/upload');
const authorize = require('../middleware/authorize');
const {
  getIncidents,
  getIncidentById,
  createIncident,
  deleteIncident,
  addIncidentAttachment,
  updateMetaIncident,
} = require('../controllers/incident_controller');

const incidentRoutes = express.Router();

incidentRoutes.get('/', authMiddlware, getIncidents);

incidentRoutes.get('/:id', authMiddlware, getIncidentById);

incidentRoutes.post(
  '/',
  authMiddlware,
  authorize('admin', 'manager'),
  createIncident
);

incidentRoutes.delete(
  '/:id',
  authMiddlware,
  authorize('admin', 'manager'),
  deleteIncident
);

incidentRoutes.post(
  '/:id/attachment',
  authMiddlware,
  upload.array('image', 10), // Accept multiple files (up to 10) with field name 'image',
  addIncidentAttachment
);

incidentRoutes.put(
  '/:id',
  authMiddlware,
  authorize('admin', 'manager'),
  updateMetaIncident
);
module.exports = {incidentRoutes};
