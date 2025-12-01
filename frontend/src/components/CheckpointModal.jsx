import { useState, useEffect } from 'react';
import './CheckpointModal.css';

const CheckpointModal = ({ isOpen, onClose, onSave, checkpoint }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hint: '',
    order: 0,
    type: 'media',
    solution: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (checkpoint) {
        setFormData({
          title: checkpoint.title || '',
          description: checkpoint.description || '',
          hint: checkpoint.hint || '',
          order: checkpoint.order !== undefined ? checkpoint.order : 0,
          type: checkpoint.type || 'media',
          solution: checkpoint.solution || '',
        });
        if (checkpoint.image) {
          setImagePreview(`/${checkpoint.image}`);
        } else {
          setImagePreview('');
        }
      } else {
        // Reset form for creating a new one
        setFormData({
          title: '',
          description: '',
          hint: '',
          order: 0,
          type: 'media',
          solution: '',
        });
        setImageFile(null);
        setImagePreview('');
      }
    }
  }, [checkpoint, isOpen]); // Rerun when checkpoint or isOpen changes

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('hint', formData.hint);
    data.append('order', formData.order);
    data.append('type', formData.type || 'media');
    if (formData.type === 'text') data.append('solution', formData.solution || '');
    if (imageFile) {
      data.append('image', imageFile);
    }
    onSave(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{checkpoint ? 'Edit Checkpoint' : 'Create New Checkpoint'}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Hint (Optional)</label>
              <input type="text" name="hint" value={formData.hint} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Image (Optional)</label>
              <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ marginTop: '1rem', maxWidth: '100%', height: 'auto' }} />
              )}
            </div>
            <div className="form-group">
              <label>Checkpoint Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="media">Media (image/video upload)</option>
                <option value="text">Text answer</option>
              </select>
            </div>

            {formData.type === 'text' && (
              <div className="form-group">
                <label>Correct Answer (text)</label>
                <input type="text" name="solution" value={formData.solution} onChange={handleChange} required />
              </div>
            )}
            <div className="form-group">
              <label>Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckpointModal;