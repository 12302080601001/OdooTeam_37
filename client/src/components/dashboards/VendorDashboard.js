import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`/api/dashboard/vendor/${user.id}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching vendor dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading vendor dashboard..." />;
  }

  const stats = dashboardData?.stats || {};
  const recentBookings = dashboardData?.recentBookings || [];
  const servicePerformance = dashboardData?.servicePerformance || [];
  const topServices = dashboardData?.topServices || [];

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
      {/* Vendor Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern gradient-bg-success text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="font-poppins mb-2">
                    <i className="fas fa-store me-2"></i>
                    Vendor Dashboard
                  </h2>
                  <p className="mb-0 opacity-90">
                    Manage your services, track bookings, and grow your travel business!
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <Link to="/vendor/services/create" className="btn btn-light btn-modern">
                    <i className="fas fa-plus me-2"></i>
                    Add Service
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
                <i className="fas fa-concierge-bell fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.totalServices || 0}</h3>
              <p className="text-muted mb-0">Total Services</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-check-circle fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.activeServices || 0}</h3>
              <p className="text-muted mb-0">Active Services</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="fas fa-calendar-check fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.totalBookings || 0}</h3>
              <p className="text-muted mb-0">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-dollar-sign fa-2x"></i>
              </div>
              <h3 className="fw-bold">${stats.totalRevenue?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="row">
        {/* Recent Bookings */}
        <div className="col-lg-8 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-calendar-alt me-2 text-primary"></i>
                  Recent Bookings
                </h5>
                <Link to="/vendor/bookings" className="btn btn-outline-primary btn-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentBookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                                   style={{ width: '32px', height: '32px' }}>
                                <i className="fas fa-user text-white"></i>
                              </div>
                              <div>
                                <div className="fw-semibold">{booking.user?.firstName} {booking.user?.lastName}</div>
                                <small className="text-muted">{booking.user?.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>{booking.service?.title}</td>
                          <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                          <td>${booking.totalAmount}</td>
                          <td>
                            <span className={`badge ${
                              booking.status === 'confirmed' ? 'bg-success' :
                              booking.status === 'pending' ? 'bg-warning' :
                              booking.status === 'cancelled' ? 'bg-danger' : 'bg-info'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="btn btn-outline-success">
                                <i className="fas fa-check"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <h6>No bookings yet</h6>
                  <p className="text-muted">Your bookings will appear here once customers start booking your services.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Services */}
        <div className="col-lg-4 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-star me-2 text-warning"></i>
                Top Services
              </h5>
            </div>
            <div className="card-body">
              {topServices.length > 0 ? (
                <div className="list-group list-group-flush">
                  {topServices.slice(0, 5).map((service, index) => (
                    <div key={service.id} className="list-group-item d-flex justify-content-between align-items-start px-0">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{service.title}</h6>
                        <small className="text-muted">
                          {service.bookings} bookings • ${service.revenue?.toLocaleString()}
                        </small>
                        <div className="mt-1">
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-star me-1"></i>
                            {service.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <span className="badge bg-primary rounded-pill">{index + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-concierge-bell fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No services yet</p>
                  <Link to="/vendor/services/create" className="btn btn-primary btn-sm">
                    Add Your First Service
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service Performance */}
      {servicePerformance.length > 0 && (
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="fas fa-chart-bar me-2 text-info"></i>
                  Service Performance
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                        <th>Rating</th>
                        <th>Reviews</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicePerformance.map((service) => (
                        <tr key={service.id}>
                          <td>
                            <div className="fw-semibold">{service.title}</div>
                          </td>
                          <td>
                            <span className="badge bg-info">{service.bookings}</span>
                          </td>
                          <td>
                            <span className="fw-bold text-success">${service.revenue?.toLocaleString() || 0}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-1">{service.rating?.toFixed(1) || 'N/A'}</span>
                              <i className="fas fa-star text-warning"></i>
                            </div>
                          </td>
                          <td>{service.reviewCount}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link to={`/vendor/services/${service.id}`} className="btn btn-outline-primary">
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link to={`/vendor/services/${service.id}/edit`} className="btn btn-outline-warning">
                                <i className="fas fa-edit"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                  <Link to="/vendor/services/create" className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-plus fa-2x mb-2"></i>
                    <span>Add Service</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/vendor/bookings" className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-calendar-check fa-2x mb-2"></i>
                    <span>Manage Bookings</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/vendor/revenue" className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-chart-line fa-2x mb-2"></i>
                    <span>Revenue Analytics</span>
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

export default VendorDashboard;
