import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/admin');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading admin dashboard..." />;
  }

  const userStats = dashboardData?.userStats || {};
  const tripStats = dashboardData?.tripStats || {};
  const popularDestinations = dashboardData?.popularDestinations || [];
  const monthlyTrends = dashboardData?.monthlyTrends || [];
  const recentUsers = dashboardData?.recentUsers || [];

  // Chart data
  const userRoleChartData = {
    labels: userStats.roles?.map(role => role.role.charAt(0).toUpperCase() + role.role.slice(1)) || [],
    datasets: [
      {
        data: userStats.roles?.map(role => role.count) || [],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  const monthlyTrendsChartData = {
    labels: monthlyTrends.map(item => item.month),
    datasets: [
      {
        label: 'New Trips',
        data: monthlyTrends.map(item => item.trips),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const destinationChartData = {
    labels: popularDestinations.slice(0, 10).map(d => d.destination),
    datasets: [
      {
        label: 'Trips',
        data: popularDestinations.slice(0, 10).map(d => d.count),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }
    ]
  };

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
      {/* Admin Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern gradient-bg text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="font-poppins mb-2">
                    <i className="fas fa-crown me-2"></i>
                    Admin Dashboard
                  </h2>
                  <p className="mb-0 opacity-90">
                    Monitor platform performance and manage the GlobeTrotter community
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-light btn-sm">
                      <i className="fas fa-download me-1"></i>
                      Export Data
                    </button>
                    <button className="btn btn-outline-light btn-sm">
                      <i className="fas fa-cog me-1"></i>
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="fw-bold">{userStats.total?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-1">Total Users</p>
              <small className="text-success">
                <i className="fas fa-arrow-up me-1"></i>
                +{userStats.newThisMonth || 0} this month
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-user-check fa-2x"></i>
              </div>
              <h3 className="fw-bold">{userStats.active?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-1">Active Users</p>
              <small className="text-info">
                {userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0}% of total
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="fas fa-suitcase fa-2x"></i>
              </div>
              <h3 className="fw-bold">{tripStats.total?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-1">Total Trips</p>
              <small className="text-success">
                <i className="fas fa-arrow-up me-1"></i>
                +{tripStats.newThisMonth || 0} this month
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-globe fa-2x"></i>
              </div>
              <h3 className="fw-bold">{tripStats.public?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-1">Public Trips</p>
              <small className="text-info">
                {tripStats.total > 0 ? Math.round((tripStats.public / tripStats.total) * 100) : 0}% of total
              </small>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-chart-bar me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users me-2"></i>
                Users
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'trips' ? 'active' : ''}`}
                onClick={() => setActiveTab('trips')}
              >
                <i className="fas fa-suitcase me-2"></i>
                Trips
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="fas fa-chart-line me-2"></i>
                Analytics
              </button>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="row">
          {/* User Role Distribution */}
          <div className="col-lg-4 mb-4">
            <motion.div variants={itemVariants} className="card card-modern h-100">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="fas fa-user-tag me-2 text-primary"></i>
                  User Roles
                </h5>
              </div>
              <div className="card-body">
                {userStats.roles?.length > 0 ? (
                  <div className="chart-container" style={{ height: '250px' }}>
                    <Doughnut 
                      data={userRoleChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No user data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Monthly Trends */}
          <div className="col-lg-8 mb-4">
            <motion.div variants={itemVariants} className="card card-modern h-100">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="fas fa-chart-line me-2 text-success"></i>
                  Trip Creation Trends
                </h5>
              </div>
              <div className="card-body">
                {monthlyTrends.length > 0 ? (
                  <div className="chart-container" style={{ height: '250px' }}>
                    <Line 
                      data={monthlyTrendsChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No trend data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <motion.div variants={itemVariants} className="row">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header bg-transparent border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-users me-2 text-primary"></i>
                    Recent Users
                  </h5>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-plus me-1"></i>
                    Add User
                  </button>
                </div>
              </div>
              <div className="card-body">
                {recentUsers.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                                     style={{ width: '32px', height: '32px' }}>
                                  <i className="fas fa-user text-white"></i>
                                </div>
                                <div>
                                  <div className="fw-semibold">{user.firstName} {user.lastName}</div>
                                </div>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${
                                user.role === 'admin' ? 'bg-danger' :
                                user.role === 'planner' ? 'bg-info' :
                                user.role === 'vendor' ? 'bg-success' : 'bg-primary'
                              }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary">
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="btn btn-outline-warning">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-outline-danger">
                                  <i className="fas fa-ban"></i>
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
                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No users found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'analytics' && (
        <motion.div variants={itemVariants} className="row">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="fas fa-map-marked-alt me-2 text-warning"></i>
                  Popular Destinations
                </h5>
              </div>
              <div className="card-body">
                {popularDestinations.length > 0 ? (
                  <div className="chart-container" style={{ height: '400px' }}>
                    <Bar 
                      data={destinationChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No destination data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
