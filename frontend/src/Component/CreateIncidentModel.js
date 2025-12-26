import {useState} from 'react';
import {api} from '../Api/api';

export default function CreateIncidentModal({
  show,
  onClose,
  onSuccess,
  projects,
}) {
  const [modalStep, setModalStep] = useState(1); // 1 = incident form, 2 = attachments
  const [incidentId, setIncidentId] = useState(null);

  // Step 1: Incident form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [severity, setSeverity] = useState('low');
  const [status, setStatus] = useState('open');

  // Step 2: Attachment fields
  const [files, setFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  if (!show) return null;

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !projectId) {
      setError('Title and Project are required');
      return;
    }

    try {
      setCreating(true);

      const response = await api.createIncident({
        title: title.trim(),
        description: description.trim(),
        project_id: parseInt(projectId),
        severity,
        status,
      });

      // Store the created incident ID and move to step 2
      setIncidentId(response.data.incident_id);
      setModalStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to create incident. Please try again.'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleAddAttachments = async () => {
    if (files.length === 0) {
      // Skip attachments, close modal
      handleClose();
      onSuccess();
      return;
    }

    try {
      setUploading(true);
      await api.addIncidentAttachment(incidentId, files);

      // Close modal and notify parent
      handleClose();
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to upload attachments. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSkipAttachments = () => {
    handleClose();
    onSuccess();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setFileInputKey((prev) => prev + 1);
  };

  const handleClose = () => {
    // Reset all state
    setModalStep(1);
    setIncidentId(null);
    setTitle('');
    setDescription('');
    setProjectId('');
    setSeverity('low');
    setStatus('open');
    setFiles([]);
    setFileInputKey((prev) => prev + 1);
    setError('');
    onClose();
  };

  return (
    <>
      <div
        className="modal show"
        style={{display: 'block'}}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalStep === 1 ? 'Create New Incident' : 'Add Attachments'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
                disabled={creating || uploading}
              ></button>
            </div>

            {/* Step 1: Incident Form */}
            {modalStep === 1 && (
              <form onSubmit={handleCreateIncident}>
                <div className="modal-body">
                  {error && (
                    <div
                      className="alert alert-danger"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="incidentTitle"
                      className="form-label"
                    >
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="incidentTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter incident title"
                      required
                      disabled={creating}
                      maxLength={80}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="incidentDescription"
                      className="form-label"
                    >
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="incidentDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter incident description"
                      rows="4"
                      disabled={creating}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="incidentProject"
                      className="form-label"
                    >
                      Project <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="incidentProject"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      required
                      disabled={creating}
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option
                          key={project.project_id}
                          value={project.project_id}
                        >
                          {project.project_name} - {project.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="incidentSeverity"
                          className="form-label"
                        >
                          Severity
                        </label>
                        <select
                          className="form-select"
                          id="incidentSeverity"
                          value={severity}
                          onChange={(e) => setSeverity(e.target.value)}
                          disabled={creating}
                        >
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="incidentStatus"
                          className="form-label"
                        >
                          Status
                        </label>
                        <select
                          className="form-select"
                          id="incidentStatus"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          disabled={creating}
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
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
                      'Next: Add Attachments'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Attachments Form */}
            {modalStep === 2 && (
              <div>
                <div className="modal-body">
                  {error && (
                    <div
                      className="alert alert-danger"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <div
                    className="alert alert-success"
                    role="alert"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Incident created successfully! You can now add attachments
                    or skip this step.
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="incidentFiles"
                      className="form-label"
                    >
                      Attachments (Optional)
                    </label>
                    <input
                      key={fileInputKey}
                      type="file"
                      className="form-control"
                      id="incidentFiles"
                      multiple
                      onChange={handleFileChange}
                      disabled={uploading}
                      accept="image/*"
                    />
                    <small className="form-text text-muted">
                      You can select multiple files (up to 10)
                    </small>
                  </div>

                  {files.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">Selected Files:</label>
                      <ul className="list-group">
                        {files.map((file, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span>{file.name}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveFile(index)}
                              disabled={uploading}
                            >
                              <i className="bi bi-x-circle"></i> Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleSkipAttachments}
                    disabled={uploading}
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddAttachments}
                    disabled={uploading || files.length === 0}
                  >
                    {uploading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Uploading...
                      </>
                    ) : (
                      'Add Attachments'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop show"
        onClick={handleClose}
      ></div>
    </>
  );
}
