import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const PlannerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`/api/dashboard/planner/${user.id}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching planner dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading planner dashboard..." />;
  }

  const stats = dashboardData?.stats || {};
  const publicTrips = dashboardData?.publicTrips || [];
  const topTrips = dashboardData?.topTrips || [];
  const topDestinations = dashboardData?.topDestinations || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-fluid"
    >
      {/* Planner Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern gradient-bg-secondary text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="font-poppins mb-2">
                    <i className="fas fa-map-marked-alt me-2"></i>
                    Travel Planner Dashboard
                  </h2>
                  <p className="mb-0 opacity-90">
                    Create amazing public itineraries and inspire fellow travelers!
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <Link to="/planner/create" className="btn btn-light btn-modern">
                    <i className="fas fa-plus me-2"></i>
                    Create Itinerary
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-globe fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.totalPublicTrips || 0}</h3>
              <p className="text-muted mb-0">Public Itineraries</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-eye fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.totalViews?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-0">Total Views</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="fas fa-heart fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.totalLikes?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-0">Total Likes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-copy fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.totalCopies?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-0">Times Copied</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="row">
        {/* Public Itineraries */}
        <div className="col-lg-8 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-list me-2 text-primary"></i>
                  My Public Itineraries
                </h5>
                <Link to="/planner/trips" className="btn btn-outline-primary btn-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {publicTrips.length > 0 ? (
                <div className="row">
                  {publicTrips.slice(0, 4).map((trip, index) => (
                    <div key={trip.id} className="col-md-6 mb-3">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="card border"
                      >
                        <div className="card-body p-3">
                          <h6 className="card-title">{trip.title}</h6>
                          <p className="text-muted small mb-2">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {trip.destinations?.join(', ') || 'No destinations'}
                          </p>
                          <div className="row text-center mb-2">
                            <div className="col-4">
                              <small className="text-muted">Views</small>
                              <div className="fw-bold">{trip.views || 0}</div>
                            </div>
                            <div className="col-4">
                              <small className="text-muted">Likes</small>
                              <div className="fw-bold">{trip.likes || 0}</div>
                            </div>
                            <div className="col-4">
                              <small className="text-muted">Copies</small>
                              <div className="fw-bold">{trip.copies || 0}</div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-success">Public</span>
                            <Link to={`/trips/${trip.id}`} className="btn btn-sm btn-outline-primary">
                              View
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-globe fa-3x text-muted mb-3"></i>
                  <h6>No public itineraries yet</h6>
                  <p className="text-muted">Create your first public itinerary to inspire other travelers!</p>
                  <Link to="/planner/create" className="btn btn-primary">
                    Create First Itinerary
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Destinations */}
        <div className="col-lg-4 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-star me-2 text-warning"></i>
                Top Destinations
              </h5>
            </div>
            <div className="card-body">
              {topDestinations.length > 0 ? (
                <div className="list-group list-group-flush">
                  {topDestinations.map((destination, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <div>
                        <i className="fas fa-map-marker-alt text-primary me-2"></i>
                        {destination.destination}
                      </div>
                      <span className="badge bg-primary rounded-pill">{destination.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No destination data yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top Performing Itineraries */}
      {topTrips.length > 0 && (
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="fas fa-trophy me-2 text-warning"></i>
                  Top Performing Itineraries
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Itinerary</th>
                        <th>Destinations</th>
                        <th>Views</th>
                        <th>Likes</th>
                        <th>Copies</th>
                        <th>Engagement</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTrips.map((trip) => {
                        const engagement = (trip.views || 0) + (trip.likes || 0) + (trip.copies || 0);
                        return (
                          <tr key={trip.id}>
                            <td>
                              <div className="fw-semibold">{trip.title}</div>
                              <small className="text-muted">
                                Created {new Date(trip.createdAt).toLocaleDateString()}
                              </small>
                            </td>
                            <td>{trip.destinations?.join(', ') || 'N/A'}</td>
                            <td>
                              <span className="badge bg-info">{trip.views || 0}</span>
                            </td>
                            <td>
                              <span className="badge bg-danger">{trip.likes || 0}</span>
                            </td>
                            <td>
                              <span className="badge bg-success">{trip.copies || 0}</span>
                            </td>
                            <td>
                              <div className="fw-bold">{engagement}</div>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <Link to={`/trips/${trip.id}`} className="btn btn-outline-primary">
                                  <i className="fas fa-eye"></i>
                                </Link>
                                <Link to={`/trips/${trip.id}/edit`} className="btn btn-outline-warning">
                                  <i className="fas fa-edit"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="row">
        <div className="col-12">
          <div className="card card-modern">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-bolt me-2 text-danger"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/planner/create" className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-plus fa-2x mb-2"></i>
                    <span>Create Itinerary</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/planner/analytics" className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-chart-line fa-2x mb-2"></i>
                    <span>View Analytics</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/public-trips" className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-search fa-2x mb-2"></i>
                    <span>Explore Trips</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/profile" className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-user fa-2x mb-2"></i>
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlannerDashboard;
