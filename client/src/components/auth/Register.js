import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'traveller',
    phone: '',
    country: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center gradient-bg py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
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
                  <h2 className="font-poppins fw-bold text-gradient">Join GlobeTrotter</h2>
                  <p className="text-muted">Create your account and start planning amazing trips!</p>
                </div>

                <form onSubmit={handleSubmit} className="form-modern">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="firstName">
                          <i className="fas fa-user me-2"></i>First Name
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="lastName">
                          <i className="fas fa-user me-2"></i>Last Name
                        </label>
                      </div>
                    </div>
                  </div>

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

                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="confirmPassword">
                          <i className="fas fa-lock me-2"></i>Confirm Password
                        </label>
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3"
                          style={{ zIndex: 10 }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="traveller">Traveller</option>
                        <option value="planner">Travel Planner</option>
                        <option value="vendor">Vendor/Partner</option>
                      </select>
                      <label htmlFor="role">
                        <i className="fas fa-user-tag me-2"></i>I am a...
                      </label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          placeholder="Country"
                          value={formData.country}
                          onChange={handleChange}
                        />
                        <label htmlFor="country">
                          <i className="fas fa-flag me-2"></i>Country
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                        />
                        <label htmlFor="city">
                          <i className="fas fa-map-marker-alt me-2"></i>City
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      <label htmlFor="phone">
                        <i className="fas fa-phone me-2"></i>Phone Number (Optional)
                      </label>
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="terms" required />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the <Link to="/terms" className="text-decoration-none">Terms of Service</Link> and{' '}
                      <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </motion.button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-bold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
