import React from 'react';

const MediaDisplay = ({ src, alt, className }) => {
  const isVideo = /\.(mp4|mov|avi|wmv)$/i.test(src);

  if (isVideo) {
    return (
      <video controls className={className} style={{ width: '100%' }}>
        <source src={src} type={`video/${src.split('.').pop()}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return <img src={src} alt={alt} className={className} />;
};

export default MediaDisplay;
