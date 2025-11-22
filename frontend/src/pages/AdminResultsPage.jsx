import { useState, useEffect } from 'react';
import checkpointService from '../services/checkpointService';
import teamService from '../services/teamService';
import submissionService from '../services/submissionService';
import './AdminResultsPage.css';
import MediaDisplay from '../components/MediaDisplay';

const AdminResultsPage = () => {
  const [viewMode, setViewMode] = useState('checkpoint'); // 'checkpoint' or 'team'
  const [checkpoints, setCheckpoints] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial data for dropdowns
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const checkpointsData = await checkpointService.getCheckpoints();
        const teamsData = await teamService.getAllTeams();
        setCheckpoints(checkpointsData);
        setTeams(teamsData);
      } catch (error) {
        console.error('Failed to fetch initial data', error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch submissions when the selected ID or view mode changes
  useEffect(() => {
    if (!selectedId) {
      setSubmissions([]);
      return;
    }

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        let data;
        if (viewMode === 'checkpoint') {
          data = await submissionService.getSubmissionsForCheckpoint(selectedId);
        } else {
          data = await submissionService.getSubmissionsForTeam(selectedId);
        }
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [selectedId, viewMode]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSelectedId('');
    setSubmissions([]);
  };

  return (
    <div>
      <h2>View Submissions</h2>
      <div className="results-view-toggle">
        <button
          className={`toggle-btn ${viewMode === 'checkpoint' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('checkpoint')}
        >
          By Checkpoint
        </button>
        <button
          className={`toggle-btn ${viewMode === 'team' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('team')}
        >
          By Team
        </button>
      </div>

      <div className="results-filter">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">-- Select a {viewMode} --</option>
          {viewMode === 'checkpoint'
            ? checkpoints.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.order + 1}. {c.title}
                </option>
              ))
            : teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.username}
                </option>
              ))}
        </select>
      </div>

      {loading && <p>Loading submissions...</p>}
      {!loading && submissions.length === 0 && selectedId && <p>No submissions found.</p>}

      <div className="submissions-grid">
        {submissions.map((sub) => (
          <div key={sub._id} className="submission-card">
            <MediaDisplay src={sub.imageUrl} alt="Submission" />
            <div className="submission-card-info">
              {viewMode === 'checkpoint' ? (
                <h4>Team: {sub.teamId.username}</h4>
              ) : (
                <h4>Checkpoint: {sub.checkpointId.order + 1}. {sub.checkpointId.title}</h4>
              )}
              <p>Submitted: {new Date(sub.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminResultsPage;
