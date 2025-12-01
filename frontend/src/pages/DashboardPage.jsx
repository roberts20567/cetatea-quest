// frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import checkpointService from '../services/checkpointService';
import submissionService from '../services/submissionService';
import teamService from '../services/teamService';
import CheckpointItem from '../components/CheckpointItem';
import CheckpointDetail from '../components/CheckpointDetail';
import './DashboardPage.css';

const DashboardPage = () => {
  const [checkpoints, setCheckpoints] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamInfo, setTeamInfo] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const checkpointsData = await checkpointService.getCheckpoints();
      const submissionsData = await submissionService.getMySubmissions();
      const myInfo = await teamService.getMyInfo();
      setCheckpoints(checkpointsData);
      setSubmissions(submissionsData);
      setTeamInfo(myInfo);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  const handleStartQuest = async () => {
    try {
      await teamService.startQuest();
      const myInfo = await teamService.getMyInfo();
      setTeamInfo(myInfo);
    } catch (err) {
      console.error('Failed to start quest', err);
    }
  };

  const handleUploadSuccess = () => {
    // Refetch submissions data after a successful upload
    submissionService.getMySubmissions().then(setSubmissions);
  };

  return (
    <>
      <h1 style={{ gridColumn: '1 / -1' }}>Team Dashboard</h1>
      {loading && <p className="loading-message">Loading checkpoints...</p>}
      {error && <p className="error-message-dashboard">{error}</p>}
      {!loading && !error && (
        <div className="dashboard-container">
          {/* If team hasn't started, show Start Quest button. Otherwise show checkpoints */}
          {!teamInfo || !teamInfo.questStart ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h3>Ready to begin?</h3>
              <p>Press the button below to start the quest timer for your team.</p>
              <button className="btn" onClick={handleStartQuest}>Start Quest</button>
            </div>
          ) : (
            <div className="checkpoints-list">
              {checkpoints.length > 0 ? (
                checkpoints.map((checkpoint) => {
                  const isCompleted = submissions.some(s => s.checkpointId._id === checkpoint._id);
                  return (
                    <CheckpointItem
                      key={checkpoint._id}
                      checkpoint={checkpoint}
                      isCompleted={isCompleted}
                      onClick={() => setSelectedCheckpoint(checkpoint)}
                    />
                  );
                })
              ) : (
                <p>No checkpoints have been added yet.</p>
              )}
            </div>
          )}
          <CheckpointDetail
            checkpoint={selectedCheckpoint}
            submission={submissions.find(s => s.checkpointId._id === selectedCheckpoint?._id)}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      )}
    </>
  );
};

export default DashboardPage;
