import {useState, useEffect} from 'react';
import {api} from '../Api/api';
import CreateIncidentModal from '../Component/CreateIncidentModal';

export default function IncidentPage({token}) {
  const [incidents, setIncidents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(' ');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchIncidents();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.getAllProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(' ');
      const response = await api.listIncidents();
      setIncidents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load incidents. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncident = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) {
      return;
    }

    try {
      await api.deleteIncident(id);
      await fetchIncidents();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to delete incident. Please try again.'
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'badge bg-danger';
      case 'moderate':
        return 'badge bg-warning';
      case 'low':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'open' ? 'badge bg-success' : 'badge bg-secondary';
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Incidents Dashboard</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create New Incident
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
      ) : incidents.length === 0 ? (
        <div
          className="alert alert-info"
          role="alert"
        >
          No incidents found. Click "Create New Incident" to get started.
        </div>
      ) : (
        /* Incidents Table */
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Project ID</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Reported On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.incident_id}>
                      <td>{incident.incident_id}</td>
                      <td>
                        <strong>{incident.title}</strong>
                      </td>
                      <td>
                        {incident.description
                          ? incident.description.substring(0, 50) +
                            (incident.description.length > 50 ? '...' : '')
                          : 'N/A'}
                      </td>
                      <td>{incident.project_id}</td>
                      <td>
                        <span
                          className={getSeverityBadgeClass(incident.severity)}
                        >
                          {incident.severity}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(incident.status)}>
                          {incident.status}
                        </span>
                      </td>
                      <td>{formatDate(incident.reported_on)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDeleteIncident(incident.incident_id)
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

      {/* Create Incident Modal */}
      <CreateIncidentModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchIncidents}
        projects={projects}
      />
    </div>
  );
}
