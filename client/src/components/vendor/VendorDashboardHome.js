import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorDashboardHome = () => {
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

  const { stats = {}, recentBookings = [], topServices = [] } = dashboardData || {};

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
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-fluid"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern gradient-bg-success text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="font-poppins mb-2">
                    <i className="fas fa-store me-2"></i>
                    Welcome back, {user?.firstName}!
                  </h2>
                  <p className="mb-0 opacity-90">
                    Manage your services, track bookings, and grow your travel business!
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <Link to="/vendor/services/create" className="btn btn-light btn-modern me-2">
                    <i className="fas fa-plus me-2"></i>
                    Add Service
                  </Link>
                  <Link to="/vendor/marketing/promote" className="btn btn-outline-light btn-modern">
                    <i className="fas fa-bullhorn me-2"></i>
                    Promote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="text-primary mb-3">
                <i className="fas fa-concierge-bell fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">{stats.totalServices || 0}</h3>
              <p className="text-muted mb-2">Total Services</p>
              <small className="text-success">
                <i className="fas fa-arrow-up me-1"></i>
                +{stats.newServicesThisMonth || 0} this month
              </small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="text-success mb-3">
                <i className="fas fa-calendar-check fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">{stats.totalBookings || 0}</h3>
              <p className="text-muted mb-2">Total Bookings</p>
              <small className="text-success">
                <i className="fas fa-arrow-up me-1"></i>
                +{stats.newBookingsThisWeek || 0} this week
              </small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="text-info mb-3">
                <i className="fas fa-dollar-sign fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">${stats.totalRevenue?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-2">Total Revenue</p>
              <small className="text-success">
                <i className="fas fa-arrow-up me-1"></i>
                +${stats.revenueThisMonth?.toLocaleString() || 0} this month
              </small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="text-warning mb-3">
                <i className="fas fa-star fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">{stats.averageRating?.toFixed(1) || 'N/A'}</h3>
              <p className="text-muted mb-2">Average Rating</p>
              <small className="text-muted">
                From {stats.totalReviews || 0} reviews
              </small>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="row">
        {/* Recent Bookings */}
        <div className="col-lg-8 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100 border-0 shadow-sm">
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
                              booking.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link to={`/vendor/bookings/${booking.id}`} className="btn btn-outline-primary">
                                <i className="fas fa-eye"></i>
                              </Link>
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
                  <p className="text-muted">No recent bookings found</p>
                  <Link to="/vendor/marketing" className="btn btn-primary">
                    Promote Your Services
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Services */}
        <div className="col-lg-4 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100 border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-trophy me-2 text-warning"></i>
                  Top Services
                </h5>
                <Link to="/vendor/services" className="btn btn-outline-primary btn-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {topServices.length > 0 ? (
                <div className="list-group list-group-flush">
                  {topServices.slice(0, 5).map((service, index) => (
                    <div key={service.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <span className={`badge ${
                            index === 0 ? 'bg-warning' : 
                            index === 1 ? 'bg-secondary' : 
                            index === 2 ? 'bg-info' : 'bg-light text-dark'
                          } rounded-pill`}>
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{service.title}</h6>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">
                              <i className="fas fa-star text-warning me-1"></i>
                              {service.rating?.toFixed(1) || 'N/A'}
                            </small>
                            <small className="text-success fw-bold">
                              ${service.revenue?.toLocaleString() || 0}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No service data available</p>
                  <Link to="/vendor/services/create" className="btn btn-primary">
                    Add Your First Service
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="row">
        <div className="col-12">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-bolt me-2 text-danger"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                  <Link to="/vendor/services/create" className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-plus fa-2x mb-2"></i>
                    <span>Add Service</span>
                  </Link>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                  <Link to="/vendor/bookings" className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-calendar-check fa-2x mb-2"></i>
                    <span>Manage Bookings</span>
                  </Link>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                  <Link to="/vendor/revenue" className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-chart-line fa-2x mb-2"></i>
                    <span>Revenue Analytics</span>
                  </Link>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                  <Link to="/vendor/reviews" className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-star fa-2x mb-2"></i>
                    <span>Reviews</span>
                  </Link>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                  <Link to="/vendor/marketing" className="btn btn-outline-danger w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-bullhorn fa-2x mb-2"></i>
                    <span>Marketing</span>
                  </Link>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                  <Link to="/vendor/reports" className="btn btn-outline-secondary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-chart-bar fa-2x mb-2"></i>
                    <span>Reports</span>
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

export default VendorDashboardHome;
