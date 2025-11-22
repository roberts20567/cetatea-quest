import { useState, useEffect } from 'react';
import './CheckpointModal.css';

const CheckpointModal = ({ isOpen, onClose, onSave, checkpoint }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hint: '',
    imageUrl: '',
    order: 0,
  });

  useEffect(() => {
    if (checkpoint) {
      setFormData({
        title: checkpoint.title || '',
        description: checkpoint.description || '',
        hint: checkpoint.hint || '',
        imageUrl: checkpoint.imageUrl || '',
        order: checkpoint.order !== undefined ? checkpoint.order : 0,
      });
    } else {
      // Reset form for creating a new one
      setFormData({
        title: '',
        description: '',
        hint: '',
        imageUrl: '',
        order: 0,
      });
    }
  }, [checkpoint, isOpen]); // Rerun when checkpoint or isOpen changes

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
              <label>Image URL (Optional)</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </div>
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