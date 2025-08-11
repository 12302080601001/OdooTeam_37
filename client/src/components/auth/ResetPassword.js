import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      await axiosInstance.get(`/api/auth/verify-reset-token/${token}`);
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      toast.error('Invalid or expired reset token');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/api/auth/reset-password', {
        token,
        password: formData.password
      });

      toast.success('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (tokenValid === false) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container"
        >
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <motion.div variants={itemVariants} className="card card-modern shadow-lg">
                <div className="card-body p-5 text-center">
                  <i className="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
                  <h3 className="font-poppins mb-3">Invalid Reset Link</h3>
                  <p className="text-muted mb-4">
                    This password reset link is invalid or has expired. Please request a new one.
                  </p>
                  <div className="d-grid gap-2">
                    <Link to="/forgot-password" className="btn btn-gradient btn-modern">
                      <i className="fas fa-redo me-2"></i>
                      Request New Reset Link
                    </Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-modern">
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Login
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="loading-spinner mb-3"></div>
          <p className="text-muted">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container"
      >
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <motion.div variants={itemVariants} className="card card-modern shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-lock-open fa-3x text-success mb-3"></i>
                  <h3 className="font-poppins mb-2">Reset Your Password</h3>
                  <p className="text-muted">
                    Enter your new password below to complete the reset process.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <motion.div variants={itemVariants} className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    <small className="text-muted">Password must be at least 6 characters long</small>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Confirm New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="d-grid gap-2 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn btn-gradient btn-modern btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner me-2"></span>
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Reset Password
                        </>
                      )}
                    </motion.button>
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-center">
                    <p className="mb-0">
                      Remember your password?{' '}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        Back to Login
                      </Link>
                    </p>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
