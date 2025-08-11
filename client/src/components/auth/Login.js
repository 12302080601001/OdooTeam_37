import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center gradient-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card card-modern shadow-lg"
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <i className="fas fa-globe-americas fa-3x text-gradient mb-3"></i>
                  </motion.div>
                  <h2 className="font-poppins fw-bold text-gradient">GlobeTrotter</h2>
                  <p className="text-muted">Welcome back! Please sign in to your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="form-modern">
                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="email">
                        <i className="fas fa-envelope me-2"></i>Email address
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="password">
                        <i className="fas fa-lock me-2"></i>Password
                      </label>
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3"
                        style={{ zIndex: 10 }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn btn-gradient btn-modern w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </motion.button>

                  <div className="text-center">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot your password?
                    </Link>
                  </div>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-bold">
                      Sign up here
                    </Link>
                  </p>
                </div>

                {/* Demo Credentials */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Demo Credentials (Offline Mode):</h6>
                  <small className="text-muted">
                    <strong>Admin:</strong> admin@globetrotter.com / admin123<br />
                    <strong>Traveller:</strong> user@example.com / password123<br />
                    <strong>Planner:</strong> planner@example.com / planner123
                  </small>
                  <div className="mt-2">
                    <small className="text-info">
                      <i className="fas fa-info-circle me-1"></i>
                      Backend is offline. You can also register new accounts that will work locally.
                    </small>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
