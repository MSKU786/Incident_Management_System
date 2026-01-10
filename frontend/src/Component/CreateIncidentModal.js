import {useState} from 'react';
import {api} from '../Api/api.js'; // Make sure this path is correct (capital A)

// File upload constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB total
const MAX_FILE_COUNT = 10;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default function CreateIncidentModal({
  show,
  onClose,
  onSuccess,
  projects,
}) {
  const [modalStep, setModalStep] = useState(1);
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
  const [fileErrors, setFileErrors] = useState([]); // File-specific validation errors

  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({}); // Add field-specific errors

  if (!show) return null;

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({}); // Clear previous errors

    // Client-side validation
    if (!title.trim()) {
      setErrors({title: 'Title is required'});
      return;
    }

    if (!projectId) {
      setErrors({project_id: 'Project is required'});
      return;
    }

    try {
      setCreating(true);
      setError('');
      setErrors({});

      // Prepare data - don't send empty strings for optional fields
      const incidentData = {
        title: title.trim(),
        project_id: parseInt(projectId),
        severity: severity || 'low',
        status: status || 'open',
      };

      // Only include description if it's not empty
      if (description.trim()) {
        incidentData.description = description.trim();
      }

      const response = await api.createIncident(incidentData);

      // Handle different response structures
      const incident_id =
        response.data?.incident_id || response.data?.data?.incident_id;

      if (!incident_id) {
        throw new Error('Failed to get incident ID from response');
      }

      // Store the created incident ID and move to step 2
      setIncidentId(incident_id);
      setModalStep(2);
      setError(''); // Clear any errors on success
    } catch (err) {
      console.error('Create incident error:', err);

      // Handle field-specific errors from backend
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }

      // Handle general error message
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create incident. Please try again.';
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  // Validate files before adding them
  const validateFiles = (filesToValidate) => {
    const errors = [];
    let totalSize = 0;

    // Check total file count
    if (filesToValidate.length > MAX_FILE_COUNT) {
      errors.push(
        `Maximum ${MAX_FILE_COUNT} files allowed. You selected ${filesToValidate.length} files.`
      );
      return errors; // Return early if count exceeds
    }

    // Validate each file
    filesToValidate.forEach((file, index) => {
      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(
          `"${file.name}" is too large (${formatFileSize(
            file.size
          )}). Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`
        );
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        errors.push(
          `"${file.name}" has an invalid file type (${
            file.type || fileExtension
          }). Allowed types: Images (JPEG, PNG, GIF, WebP), PDF, Word documents, and text files.`
        );
      }

      // Accumulate total size
      if (file.size <= MAX_FILE_SIZE) {
        totalSize += file.size;
      }
    });

    // Check total size
    if (totalSize > MAX_TOTAL_SIZE) {
      errors.push(
        `Total file size (${formatFileSize(
          totalSize
        )}) exceeds the maximum allowed size of ${formatFileSize(
          MAX_TOTAL_SIZE
        )}.`
      );
    }

    return errors;
  };

  const handleAddAttachments = async () => {
    if (files.length === 0) {
      // Skip attachments, close modal
      handleClose();
      onSuccess();
      return;
    }

    // Final validation before upload
    const validationErrors = validateFiles(files);
    if (validationErrors.length > 0) {
      setFileErrors(validationErrors);
      setError('Please fix the file errors before uploading.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setFileErrors([]);

      await api.addIncidentAttachment(incidentId, files);

      // Close modal and notify parent
      handleClose();
      onSuccess();
    } catch (err) {
      console.error('Attachment upload error:', err);
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

    // Clear previous errors
    setFileErrors([]);
    setError('');

    if (selectedFiles.length === 0) {
      e.target.value = ''; // Reset input
      return;
    }

    // Combine with existing files to check total count
    const combinedFiles = [...files, ...selectedFiles];

    // Validate file count first
    if (combinedFiles.length > MAX_FILE_COUNT) {
      const errorMsg = `Maximum ${MAX_FILE_COUNT} files allowed. You currently have ${files.length} file(s) and are trying to add ${selectedFiles.length} more.`;
      setFileErrors([errorMsg]);
      setError(errorMsg);
      e.target.value = ''; // Clear input
      return;
    }

    // Validate the selected files
    const validationErrors = validateFiles(combinedFiles);

    if (validationErrors.length > 0) {
      setFileErrors(validationErrors);
      setError('Some files failed validation. Please check the errors below.');
      e.target.value = ''; // Clear input
      return;
    }

    // All validations passed, add files
    setFiles(combinedFiles);
    setFileErrors([]);
    setError('');
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
    setErrors({});
    setFileErrors([]);
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
                      className={`form-control ${
                        errors.title ? 'is-invalid' : ''
                      }`}
                      id="incidentTitle"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) {
                          setErrors({...errors, title: ''});
                        }
                      }}
                      placeholder="Enter incident title"
                      required
                      disabled={creating}
                      maxLength={80}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="incidentDescription"
                      className="form-label"
                    >
                      Description
                    </label>
                    <textarea
                      className={`form-control ${
                        errors.description ? 'is-invalid' : ''
                      }`}
                      id="incidentDescription"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          setErrors({...errors, description: ''});
                        }
                      }}
                      placeholder="Enter incident description (optional)"
                      rows="4"
                      disabled={creating}
                      maxLength={5000}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="incidentProject"
                      className="form-label"
                    >
                      Project <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.project_id ? 'is-invalid' : ''
                      }`}
                      id="incidentProject"
                      value={projectId}
                      onChange={(e) => {
                        setProjectId(e.target.value);
                        if (errors.project_id) {
                          setErrors({...errors, project_id: ''});
                        }
                      }}
                      required
                      disabled={creating}
                    >
                      <option value="">Select a project</option>
                      {projects && projects.length > 0 ? (
                        projects.map((project) => (
                          <option
                            key={project.project_id}
                            value={project.project_id}
                          >
                            {project.project_name} - {project.location}
                          </option>
                        ))
                      ) : (
                        <option disabled>No projects available</option>
                      )}
                    </select>
                    {errors.project_id && (
                      <div className="invalid-feedback">
                        {errors.project_id}
                      </div>
                    )}
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
                          className={`form-select ${
                            errors.severity ? 'is-invalid' : ''
                          }`}
                          id="incidentSeverity"
                          value={severity}
                          onChange={(e) => {
                            setSeverity(e.target.value);
                            if (errors.severity) {
                              setErrors({...errors, severity: ''});
                            }
                          }}
                          disabled={creating}
                        >
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                        </select>
                        {errors.severity && (
                          <div className="invalid-feedback">
                            {errors.severity}
                          </div>
                        )}
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
                          className={`form-select ${
                            errors.status ? 'is-invalid' : ''
                          }`}
                          id="incidentStatus"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            if (errors.status) {
                              setErrors({...errors, status: ''});
                            }
                          }}
                          disabled={creating}
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                        {errors.status && (
                          <div className="invalid-feedback">
                            {errors.status}
                          </div>
                        )}
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
                      className={`form-control ${
                        fileErrors.length > 0 ? 'is-invalid' : ''
                      }`}
                      id="incidentFiles"
                      multiple
                      onChange={handleFileChange}
                      disabled={uploading}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf,text/plain,.doc,.docx"
                    />
                    <small className="form-text text-muted">
                      You can select multiple files (up to {MAX_FILE_COUNT}).
                      Maximum {formatFileSize(MAX_FILE_SIZE)} per file,
                      {formatFileSize(MAX_TOTAL_SIZE)} total. Allowed: Images
                      (JPEG, PNG, GIF, WebP), PDF, Word documents, and text
                      files.
                    </small>
                    {fileErrors.length > 0 && (
                      <div className="invalid-feedback d-block">
                        <ul className="mb-0 small">
                          {fileErrors.map((err, index) => (
                            <li key={index}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {files.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">
                        Selected Files ({files.length}/{MAX_FILE_COUNT}):
                      </label>
                      <ul className="list-group">
                        {files.map((file, index) => {
                          const isValidSize = file.size <= MAX_FILE_SIZE;
                          const isValidType = ALLOWED_FILE_TYPES.includes(
                            file.type
                          );
                          return (
                            <li
                              key={index}
                              className={`list-group-item d-flex justify-content-between align-items-center ${
                                !isValidSize || !isValidType
                                  ? 'list-group-item-danger'
                                  : ''
                              }`}
                            >
                              <div className="flex-grow-1">
                                <div className="fw-semibold">{file.name}</div>
                                <small className="text-muted">
                                  {formatFileSize(file.size)}
                                  {!isValidSize && (
                                    <span className="text-danger ms-2">
                                      (Exceeds size limit)
                                    </span>
                                  )}
                                  {!isValidType && (
                                    <span className="text-danger ms-2">
                                      (Invalid file type)
                                    </span>
                                  )}
                                </small>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger ms-2"
                                onClick={() => handleRemoveFile(index)}
                                disabled={uploading}
                              >
                                <i className="bi bi-x-circle"></i> Remove
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-2">
                        <small className="text-muted">
                          Total size:{' '}
                          {formatFileSize(
                            files.reduce((sum, file) => sum + file.size, 0)
                          )}{' '}
                          / {formatFileSize(MAX_TOTAL_SIZE)}
                        </small>
                      </div>
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
                    disabled={
                      uploading || files.length === 0 || fileErrors.length > 0
                    }
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
