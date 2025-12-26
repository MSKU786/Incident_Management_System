import {useState, useEffect} from 'react';
import {api} from '../Api/api';

export default function ProjectPage({token}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(' ');

  // Create project modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(' ');
      const response = await api.getAllProjects();
      setProjects(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load projects. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!projectName.trim() || !projectLocation.trim()) {
      setCreateError('Project name and location are required');
      return;
    }

    try {
      setCreating(true);

      await api.createProject(projectName.trim(), projectLocation.trim());

      // Reset form and close modal
      setProjectName('');
      setProjectLocation('');
      setShowCreateModal(false);

      // Refresh project list
      await fetchProjects();
    } catch (err) {
      setCreateError(
        err.response?.data?.message ||
          'Failed to create project. Please try again.'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await api.deleteProject(id);
      await fetchProjects();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to delete project. Please try again.'
      );
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setProjectName('');
    setProjectLocation('');
    setCreateError('');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects Dashboard</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create New Project
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div
          className="alert alert-info"
          role="alert"
        >
          No projects found. Click "Create New Project" to get started.
        </div>
      ) : (
        /* Projects Table */
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Project Name</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.project_id}>
                      <td>{project.project_id}</td>
                      <td>
                        <strong>{project.project_name}</strong>
                      </td>
                      <td>{project.location}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => {
                            // Navigate to incidents page with project filter
                            if (window.setPage) {
                              window.setPage('incidents', {
                                projectId: project.project_id,
                              });
                            }
                          }}
                        >
                          <i className="bi bi-list-ul me-1"></i>
                          View Incidents
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDeleteProject(project.project_id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          className="modal show"
          style={{display: 'block'}}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Project</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleCreateProject}>
                <div className="modal-body">
                  {createError && (
                    <div
                      className="alert alert-danger"
                      role="alert"
                    >
                      {createError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="projectName"
                      className="form-label"
                    >
                      Project Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                      required
                      disabled={creating}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="projectLocation"
                      className="form-label"
                    >
                      Location <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="projectLocation"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="Enter project location"
                      required
                      disabled={creating}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            className="modal-backdrop show"
            onClick={handleCloseModal}
          ></div>
        </div>
      )}
    </div>
  );
}
