import { useState } from 'react';
import submissionService from '../services/submissionService';
import MediaDisplay from './MediaDisplay';
import './CheckpointDetail.css';

const CheckpointDetail = ({ checkpoint, submission, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [toast, setToast] = useState(null); // { message, type }

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


  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textAnswer || textAnswer.trim() === '') {
      setToast({ message: 'Please enter an answer', type: 'error' });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    setUploading(true);
    try {
      const payload = { checkpointId: checkpoint._id, textSubmission: textAnswer };
      const result = await submissionService.createOrUpdateSubmission(payload);
      if (result && result.correct === false) {
        setToast({ message: 'Incorrect answer', type: 'error' });
      } else {
        setToast({ message: 'Correct! Checkpoint completed.', type: 'success' });
        onUploadSuccess();
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Submission failed. Try again.', type: 'error' });
    } finally {
      setUploading(false);
      setTextAnswer('');
      setTimeout(() => setToast(null), 2500);
    }
  };
  return (
    <>
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
            {submission.imageUrl ? (
              <MediaDisplay src={submission.imageUrl} alt="Your submission" className="submitted-image" />
            ) : (
              <div style={{ padding: '1rem', background: '#f7f7f7', borderRadius: 6 }}>
                <strong>Your Answer:</strong>
                <p style={{ marginTop: '0.5rem' }}>{submission.textSubmission}</p>
              </div>
            )}
            <p style={{ marginTop: '1rem' }}>To re-upload, simply choose a new file below.</p>
          </div>
        ) : (
          <p>You have not made a submission for this checkpoint yet.</p>
        )}
        {checkpoint.type === 'text' ? (
          <form onSubmit={handleTextSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="text-answer">Enter Answer:</label>
              <input id="text-answer" type="text" value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} />
            </div>
            <button type="submit" className="upload-btn" disabled={uploading}>
              {uploading ? 'Submitting...' : 'Submit Answer'}
            </button>
          </form>
        ) : (
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
        )}
      </div>
    </div>
    {toast && (
      <div className={`simple-toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
        {toast.message}
      </div>
    )}
    </>
  );
};

export default CheckpointDetail;