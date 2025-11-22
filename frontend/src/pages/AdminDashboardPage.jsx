import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import checkpointService from '../services/checkpointService';
import './AdminDashboardPage.css';
import CheckpointModal from '../components/CheckpointModal';

const AdminDashboardPage = () => {
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState(null);

  const fetchCheckpoints = async () => {
    try {
      setLoading(true);
      const data = await checkpointService.getCheckpoints();
      setCheckpoints(data);
    } catch (err) {
      setError('Failed to load checkpoints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this checkpoint?')) {
      try {
        await checkpointService.deleteCheckpoint(id);
        // Refetch checkpoints to update the list
        fetchCheckpoints();
      } catch (err) {
        setError('Failed to delete checkpoint.');
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCheckpoint(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (checkpoint) => {
    setEditingCheckpoint(checkpoint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCheckpoint(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingCheckpoint) {
        await checkpointService.updateCheckpoint(editingCheckpoint._id, formData);
      } else {
        await checkpointService.createCheckpoint(formData);
      }
      handleCloseModal();
      fetchCheckpoints(); // Refresh the list
    } catch (err) {
      setError('Failed to save checkpoint.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Panel: Manage Checkpoints</h2>
      <button className="btn" style={{ marginBottom: '2rem' }} onClick={handleOpenCreateModal}>
        + Create New Checkpoint
      </button>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin/results" className="btn">View Submissions</Link>
        <Link to="/" className="btn">Back to Dashboard</Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="admin-checkpoints-list">
        {checkpoints.map((checkpoint) => (
          <div key={checkpoint._id} className="admin-checkpoint-item">
            <div className="admin-checkpoint-info">
              <h4>{checkpoint.order + 1}. {checkpoint.title}</h4>
              <p>ID: {checkpoint._id}</p>
            </div>
            <div className="admin-checkpoint-actions">
              <button className="edit-btn" onClick={() => handleOpenEditModal(checkpoint)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(checkpoint._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <CheckpointModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        checkpoint={editingCheckpoint}
      />
    </div>
  );
};

export default AdminDashboardPage;