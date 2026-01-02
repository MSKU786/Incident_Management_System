const {Project} = require('../models/');

const createProject = async (req, res) => {
  try {
    const {name, location} = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: 'Name and location required',
      });
    }

    // Validate input
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        message: 'Project name must be a non-empty string',
      });
    }

    if (typeof location !== 'string' || location.trim().length === 0) {
      return res.status(400).json({
        message: 'Location must be a non-empty string',
      });
    }

    const project = await Project.create({
      project_name: name.trim(),
      location: location.trim(),
    });

    return res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(400).json({message: 'Project not found'});
    }

    return res.json(project);
  } catch (err) {
    console.error('Get project by ID error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(400).json({message: 'Project not found'});
    }

    const {name, location} = req.body;

    const updateData = {};
    if (name) updateData.project_name = name;
    if (location) updateData.location = location;

    await project.update(updateData);

    return res.json({msg: 'Successfully updated', project});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'server error'});
  }
};

const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const {count, rows: projects} = await Project.findAndCountAll({
      limit,
      offset,
      order: [['project_id', 'DESC']],
    });

    return res.json({
      projects,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('Get projects error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(400).json({message: 'Project not found'});
    }

    await project.destroy();

    return res.status(200).json({message: 'Project deleted successfully'});
  } catch (err) {
    console.error('Delete project error:', err);
    return res.status(500).json({message: 'Server error'});
  }
};

module.exports = {
  createProject,
  updateProject,
  getPostById,
  deleteProject,
  getAllProjects,
};
