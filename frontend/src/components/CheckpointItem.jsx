import React from 'react';
import './CheckpointItem.css';

const CheckpointItem = ({ checkpoint, onClick, isCompleted }) => {
  return (
    <div className={`checkpoint-item ${isCompleted ? 'completed' : ''}`} onClick={onClick}>
      {/* We use checkpoint.order for sorting, but display a 1-based index */}
      <h3>{checkpoint.order + 1}. {checkpoint.title} {isCompleted && '✅'}</h3>
      <p>{checkpoint.description}</p>
    </div>
  );
};

export default CheckpointItem;