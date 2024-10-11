import React from 'react';

const OptimizedImage = ({ src, alt, width, height }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );
};

export default OptimizedImage;

// Use this component instead of regular <img> tags