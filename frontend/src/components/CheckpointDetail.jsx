import { useState } from 'react';
import submissionService from '../services/submissionService';
import MediaDisplay from './MediaDisplay';
import './CheckpointDetail.css';

const CheckpointDetail = ({ checkpoint, submission, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  if (!checkpoint) {
    return (
      <div className="checkpoint-detail" style={{ textAlign: 'center' }}>
        <h2>Select a checkpoint from the list to see its details.</h2>
      </div>
    );
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('checkpointId', checkpoint._id);

    setUploading(true);
    setError('');

    try {
      await submissionService.createOrUpdateSubmission(formData);
      onUploadSuccess(); // Notify parent to refetch data
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="checkpoint-detail">
      <h2>{checkpoint.order + 1}. {checkpoint.title}</h2>      
      {checkpoint.image && <MediaDisplay src={checkpoint.image} alt={checkpoint.title} className="checkpoint-detail-image" />}
      <p>{checkpoint.description}</p>

      {checkpoint.hint && (
        <div className="hint-box">
          <strong>Hint:</strong> {checkpoint.hint}
        </div>
      )}

      <div className="upload-section">
        <h3>Your Submission</h3>
        {submission ? (
          <div className="submission-display">
            <h4>You have completed this checkpoint!</h4>
            <MediaDisplay src={submission.imageUrl} alt="Your submission" className="submitted-image" />
            <p style={{ marginTop: '1rem' }}>To re-upload, simply choose a new file below.</p>
          </div>
        ) : (
          <p>You have not made a submission for this checkpoint yet.</p>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="image-upload">Upload Image or Video:</label>
            <input type="file" id="image-upload" onChange={handleFileChange} accept="image/*,video/*" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="upload-btn" disabled={uploading || !file}>
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckpointDetail;