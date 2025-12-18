import {useState, useEffect} from 'react';
import {api} from '../API/api';

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
    </div>
  );
}
