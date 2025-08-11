import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-vh-100">
      {/* Modern Header */}
      <header className="modern-header fixed-top">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark-transparent">
          <div className="container">
            <Link className="navbar-brand fw-bold fs-3" to="/">
              <i className="fas fa-globe-americas me-2 text-primary"></i>
              GlobeTrotter
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/public-trips">Explore</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#features">Features</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#testimonials">Reviews</Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-primary btn-sm rounded-pill px-3" to="/login">Login</Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-primary btn-sm rounded-pill px-3" to="/register">Sign Up</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-5" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-4 font-poppins fw-bold mb-4">
                  Plan Your Perfect Trip with <span className="text-warning">GlobeTrotter</span>
                </h1>
                <p className="lead mb-4">
                  The world's most comprehensive travel planning platform with AI-powered recommendations,
                  budget management, and collaborative itinerary building.
                </p>
                <div className="d-flex gap-3 mb-4">
                  <Link to="/register" className="btn btn-light btn-lg btn-modern">
                    <i className="fas fa-user-plus me-2"></i>
                    Get Started Free
                  </Link>
                  <Link to="/public-trips" className="btn btn-outline-light btn-lg btn-modern">
                    <i className="fas fa-search me-2"></i>
                    Explore Trips
                  </Link>
                </div>
                <div className="row text-center">
                  <div className="col-4">
                    <h3 className="fw-bold">10K+</h3>
                    <small>Happy Travelers</small>
                  </div>
                  <div className="col-4">
                    <h3 className="fw-bold">50K+</h3>
                    <small>Trips Planned</small>
                  </div>
                  <div className="col-4">
                    <h3 className="fw-bold">200+</h3>
                    <small>Destinations</small>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-image-container position-relative"
              >
                <div className="floating-elements">
                  <div className="floating-card card-1">
                    <i className="fas fa-map-marked-alt text-primary"></i>
                    <span>Smart Planning</span>
                  </div>
                  <div className="floating-card card-2">
                    <i className="fas fa-wallet text-success"></i>
                    <span>Budget Tracking</span>
                  </div>
                  <div className="floating-card card-3">
                    <i className="fas fa-users text-info"></i>
                    <span>Community</span>
                  </div>
                </div>
                <div className="hero-mockup text-center">
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Travel Planning Dashboard"
                    className="img-fluid rounded-4 shadow-2xl main-hero-image"
                    style={{ maxHeight: '500px', objectFit: 'cover' }}
                  />
                  <div className="image-overlay-stats">
                    <div className="stat-bubble bubble-1">
                      <i className="fas fa-chart-line text-success"></i>
                      <span>98% Success Rate</span>
                    </div>
                    <div className="stat-bubble bubble-2">
                      <i className="fas fa-clock text-warning"></i>
                      <span>Save 10+ Hours</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-poppins fw-bold display-5">Why Choose GlobeTrotter?</h2>
                <p className="text-muted lead">Everything you need to plan the perfect trip</p>
              </motion.div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card card-modern h-100 text-center">
                <div className="card-body p-4">
                  <div className="text-primary mb-3">
                    <i className="fas fa-route fa-3x"></i>
                  </div>
                  <h5>Smart Itinerary Builder</h5>
                  <p className="text-muted">AI-powered recommendations and drag-and-drop itinerary planning</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card card-modern h-100 text-center">
                <div className="card-body p-4">
                  <div className="text-success mb-3">
                    <i className="fas fa-calculator fa-3x"></i>
                  </div>
                  <h5>Budget Management</h5>
                  <p className="text-muted">Track expenses, set budgets, and get cost breakdowns</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card card-modern h-100 text-center">
                <div className="card-body p-4">
                  <div className="text-warning mb-3">
                    <i className="fas fa-share-alt fa-3x"></i>
                  </div>
                  <h5>Share & Collaborate</h5>
                  <p className="text-muted">Share itineraries with friends and plan together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-poppins fw-bold display-5">What Our Travelers Say</h2>
                <p className="text-muted lead">Join thousands of happy travelers worldwide</p>
              </motion.div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card card-modern h-100"
              >
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Sarah Johnson"
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="text-warning mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="text-muted">"GlobeTrotter made planning our European adventure so easy! The budget tracking feature saved us from overspending."</p>
                  <h6 className="fw-bold">Sarah Johnson</h6>
                  <small className="text-muted">Travel Blogger</small>
                </div>
              </motion.div>
            </div>
            <div className="col-md-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card card-modern h-100"
              >
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Mike Chen"
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="text-warning mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="text-muted">"The AI recommendations were spot on! Discovered amazing hidden gems I would never have found otherwise."</p>
                  <h6 className="fw-bold">Mike Chen</h6>
                  <small className="text-muted">Adventure Seeker</small>
                </div>
              </motion.div>
            </div>
            <div className="col-md-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card card-modern h-100"
              >
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Emma Davis"
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="text-warning mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="text-muted">"Collaborative planning with friends was seamless. We all contributed to our group trip itinerary effortlessly!"</p>
                  <h6 className="fw-bold">Emma Davis</h6>
                  <small className="text-muted">Group Travel Organizer</small>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg-secondary text-white py-5">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-poppins fw-bold mb-4 display-5">Ready to Start Your Journey?</h2>
            <p className="lead mb-4">Join thousands of travelers who trust GlobeTrotter for their adventures</p>
            <Link to="/register" className="btn btn-light btn-lg btn-modern rounded-pill px-5 py-3">
              <i className="fas fa-rocket me-2"></i>
              Start Planning Now - It's Free!
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="footer-brand mb-3">
                <Link className="navbar-brand fw-bold fs-3 text-white text-decoration-none" to="/">
                  <i className="fas fa-globe-americas me-2 text-primary"></i>
                  GlobeTrotter
                </Link>
              </div>
              <p className="text-light">
                The world's most comprehensive travel planning platform.
                Plan smarter, travel better, create memories that last forever.
              </p>
              <div className="social-links">
                <a href="#" className="text-light me-3 fs-4"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-light me-3 fs-4"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-light me-3 fs-4"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-light me-3 fs-4"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3">Platform</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/public-trips" className="text-light text-decoration-none">Explore Trips</Link></li>
                <li className="mb-2"><Link to="/register" className="text-light text-decoration-none">Sign Up</Link></li>
                <li className="mb-2"><Link to="/login" className="text-light text-decoration-none">Login</Link></li>
                <li className="mb-2"><Link to="/pricing" className="text-light text-decoration-none">Pricing</Link></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3">Features</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Itinerary Builder</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Budget Tracker</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Activity Search</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Collaboration</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3">Support</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Help Center</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Contact Us</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Community</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Blog</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3">Legal</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Terms of Service</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Cookie Policy</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">GDPR</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4 border-secondary" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-light">&copy; 2024 GlobeTrotter. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0 text-light">Made with <i className="fas fa-heart text-danger"></i> for travelers worldwide</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
