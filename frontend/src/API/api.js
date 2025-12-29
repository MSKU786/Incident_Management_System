import { authAPI } from './auth';
import { projectsAPI } from './projects';
import { incidentsAPI } from './incident';

export const api = {
  // Auth methods
  login: authAPI.login,
  register: authAPI.register,
  logout: authAPI.logout,
  refreshToken: authAPI.refreshToken,

  // Project methods (backward compatibility)
  getAllProjects: projectsAPI.getAll,
  getProjectById: projectsAPI.getById,
  createProject: projectsAPI.create,
  updateProject: projectsAPI.update,
  deleteProject: projectsAPI.delete,

  // Incident methods (backward compatibility)
  listIncidents: incidentsAPI.getAll,
  createIncident: incidentsAPI.create,
  deleteIncident: incidentsAPI.delete,
  addIncidentAttachment: incidentsAPI.addAttachment,
};
