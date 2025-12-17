const {Incident, User, IncidentAttachment, Project} = require('../models/');

const createIncident = async (req, res) => {
  try {
    const {title, description, project_id, severity, status} = req.body;

    if (!title || !project_id) {
      return res
        .status(400)
        .json({message: 'Title and project_id are required'});
    }

    // Check project exists

    const project = await Project.findByPk(project_id);

    if (!project) {
      return res.status(400).json({message: 'Project not found'});
    }

    const incident = await Incident.create({
      title,
      description,
      project_id,
      reported_by: req.user.id,
      severity: severity || 'low',
      status: status || 'open',
      reported_on: new Date(),
    });

    return res.status(201).json({
      message: 'Incident created successfully',
      incident_id: incident.incident_id,
    });
  } catch (err) {
    console.error('Create incident error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const getIncidents = async (req, res) => {
  try {
    const {project_id, severity} = req.query;

    const where = {};

    if (project_id) where.project_id = project_id;
    if (severity) where.severity = severity;

    const incidents = await Incident.findAll({
      where,
      order: [['incident_id', 'DESC']],
    });

    return res.json(incidents);
  } catch (err) {
    console.error('Get incidents error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const getIncidentById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({message: 'Incident ID is required'});
    }

    const incident = await Incident.findByPk(id);

    if (!incident) {
      return res.status(404).json({
        message: 'Incident not found',
      });
    }

    const attachements = await IncidentAttachment.findAll({
      where: {
        incident_id: incident.incident_id,
      },
    });

    res.json({...incident.dataValues, attachements});
  } catch (err) {
    console.error('Get incident by ID error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const deleteIncident = async (req, res) => {
  try {
    const id = req.params.id;
    const incident = await Incident.findByPk(id);

    if (!incident) {
      return res.status(404).json({
        message: 'Incident not found',
      });
    }

    // Permission Check
    if (incident.reported_by != req.user.id || req.user.role != 'admin') {
      return res.status(403).json({message: 'not allowed '});
    }

    await IncidentAttachment.destroy({
      where: {incident_id: incident.incident_id},
    });
    await incident.destroy();

    res.json({message: 'Incident deleted successfully'});
  } catch (err) {
    console.error('Delete incident error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const addIncidentAttachment = async (req, res) => {
  try {
    const incidentId = req.params.id;

    const incident = await Incident.findByPk(incidentId);

    if (!incident) {
      return res.status(404).json({
        message: 'Incident not found',
      });
    }

    // When using upload.array(), files are in req.files (plural) as an array
    // When using upload.single(), file is in req.file (singular) as an object
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({message: 'No files uploaded'});
    }

    const attachements = req.files.map((file) => ({
      incident_id: incidentId,
      file_url: file.path, // file.path contains the full path to the uploaded file
      comments: null,
    }));

    await IncidentAttachment.bulkCreate(attachements);

    return res.status(201).json({
      message: 'Attachment Uploaded',
      uploaded: attachements.length,
    });
  } catch (err) {
    console.error('Attachment upload error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const updateMetaIncident = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const {title, description, severity, status, project_id} = req.body;

    if (!incidentId) {
      return res.status(400).json({message: 'Incident ID is required'});
    }

    const incident = await Incident.findByPk(incidentId);

    if (!incident) {
      return res.status(404).json({
        message: 'Incident not found',
      });
    }

    // Permission check: Only admin, manager, or the reporter can update
    if (
      incident.reported_by !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'manager'
    ) {
      return res
        .status(403)
        .json({message: 'Not allowed to update this incident'});
    }

    // Build update object with only provided fields
    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({message: 'Title cannot be empty'});
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (severity !== undefined) {
      if (!['low', 'moderate', 'high'].includes(severity)) {
        return res.status(400).json({
          message: 'Invalid severity. Must be low, moderate, or high',
        });
      }
      updateData.severity = severity;
    }

    if (status !== undefined) {
      if (!['open', 'closed'].includes(status)) {
        return res.status(400).json({
          message: 'Invalid status. Must be open or closed',
        });
      }
      updateData.status = status;
    }

    if (project_id !== undefined) {
      // Validate project exists if project_id is being changed
      const project = await Project.findByPk(project_id);
      if (!project) {
        return res.status(400).json({message: 'Project not found'});
      }
      updateData.project_id = project_id;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({message: 'No valid fields to update'});
    }

    // Update the incident
    await incident.update(updateData);

    return res.json({
      message: 'Incident updated successfully',
      incident: await Incident.findByPk(incidentId),
    });
  } catch (err) {
    console.error('Update incident error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

module.exports = {
  createIncident,
  getIncidentById,
  getIncidents,
  deleteIncident,
  addIncidentAttachment,
  updateMetaIncident,
};
