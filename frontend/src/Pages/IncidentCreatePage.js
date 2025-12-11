import {useState} from 'react';

export default function IncidentCreatePage({token}) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [severity, setSeverity] = useState('');

  const [files, setFiles] = useState(null);

  const [incidentId, setIncidentId] = useState(null);

  const createIncident = async () => {};

  return (
    <div className="card p-4">
      <h4> Create Incident</h4>

      <input className="" />
      <input />
    </div>
  );
}
