import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-5">
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
                className="text-center"
              >
                <i className="fas fa-globe-americas" style={{ fontSize: '20rem', opacity: 0.3 }}></i>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="font-poppins fw-bold">Why Choose GlobeTrotter?</h2>
              <p className="text-muted">Everything you need to plan the perfect trip</p>
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

      {/* CTA Section */}
      <section className="gradient-bg-secondary text-white py-5">
        <div className="container text-center">
          <h2 className="font-poppins fw-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="lead mb-4">Join thousands of travelers who trust GlobeTrotter for their adventures</p>
          <Link to="/register" className="btn btn-light btn-lg btn-modern">
            <i className="fas fa-rocket me-2"></i>
            Start Planning Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
