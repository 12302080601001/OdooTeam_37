import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

  const spinnerVariants = {
    start: {
      rotate: 0
    },
    end: {
      rotate: 360
    }
  };

  if (fullScreen) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 gradient-bg">
        <div className="text-center text-white">
          <motion.div
            variants={spinnerVariants}
            initial="start"
            animate="end"
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="mb-3"
          >
            <i className="fas fa-globe-americas fa-3x"></i>
          </motion.div>
          <h4 className="font-poppins">GlobeTrotter</h4>
          <p className="mb-0">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className="text-center">
        <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
          <span className="visually-hidden">{text}</span>
        </div>
        {text && (
          <div className="mt-2 text-muted">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
