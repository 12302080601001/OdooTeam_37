import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', {
        email
      });

      toast.success('Password reset link sent to your email!');
      setEmailSent(true);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send reset email';
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

  if (emailSent) {
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
                  <div className="mb-4">
                    <i className="fas fa-envelope-circle-check fa-4x text-success mb-3"></i>
                    <h3 className="font-poppins mb-3">Email Sent!</h3>
                    <p className="text-muted mb-4">
                      We've sent a password reset link to <strong>{email}</strong>. 
                      Please check your email and follow the instructions to reset your password.
                    </p>
                  </div>

                  <div className="d-grid gap-2">
                    <Link to="/login" className="btn btn-gradient btn-modern">
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Login
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-modern"
                      onClick={() => setEmailSent(false)}
                    >
                      Send Another Email
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
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
                  <i className="fas fa-key fa-3x text-primary mb-3"></i>
                  <h3 className="font-poppins mb-2">Forgot Password?</h3>
                  <p className="text-muted">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <motion.div variants={itemVariants} className="mb-4">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
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
                          Sending Reset Link...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Send Reset Link
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

            {/* Help Section */}
            <motion.div variants={itemVariants} className="text-center mt-4">
              <div className="card card-modern">
                <div className="card-body p-3">
                  <h6 className="mb-2">
                    <i className="fas fa-question-circle me-2 text-info"></i>
                    Need Help?
                  </h6>
                  <p className="text-muted small mb-2">
                    If you don't receive the email within a few minutes, please check your spam folder.
                  </p>
                  <p className="text-muted small mb-0">
                    Still having trouble? Contact our support team at{' '}
                    <a href="mailto:support@globetrotter.com" className="text-decoration-none">
                      support@globetrotter.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
