import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const TravellerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/traveller/${user.id}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  const stats = dashboardData?.stats || {};
  const upcomingTrips = dashboardData?.upcomingTrips || [];
  const ongoingTrips = dashboardData?.ongoingTrips || [];
  const popularDestinations = dashboardData?.popularDestinations || [];
  const budgetBreakdown = dashboardData?.budgetBreakdown || {};

  // Chart data
  const budgetChartData = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [budgetBreakdown.spent || 0, budgetBreakdown.remaining || 0],
        backgroundColor: ['#ef4444', '#10b981'],
        borderWidth: 0
      }
    ]
  };

  const destinationChartData = {
    labels: popularDestinations.map(d => d.destination),
    datasets: [
      {
        label: 'Visits',
        data: popularDestinations.map(d => d.count),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
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
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern gradient-bg text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="font-poppins mb-2">
                    Welcome back, {user?.firstName}! 🌍
                  </h2>
                  <p className="mb-0 opacity-90">
                    Ready for your next adventure? Let's plan something amazing!
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <Link to="/trips/create" className="btn btn-light btn-modern">
                    <i className="fas fa-plus me-2"></i>
                    Plan New Trip
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
                <i className="fas fa-suitcase fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.totalTrips || 0}</h3>
              <p className="text-muted mb-0">Total Trips</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-calendar-check fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.upcomingTrips || 0}</h3>
              <p className="text-muted mb-0">Upcoming Trips</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="fas fa-plane fa-2x"></i>
              </div>
              <h3 className="fw-bold">{stats.ongoingTrips || 0}</h3>
              <p className="text-muted mb-0">Ongoing Trips</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-dollar-sign fa-2x"></i>
              </div>
              <h3 className="fw-bold">${stats.totalBudget?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-0">Total Budget</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="row">
        {/* Upcoming Trips */}
        <div className="col-lg-8 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-calendar-alt me-2 text-primary"></i>
                  Upcoming Trips
                </h5>
                <Link to="/trips" className="btn btn-outline-primary btn-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {upcomingTrips.length > 0 ? (
                <div className="row">
                  {upcomingTrips.map((trip, index) => (
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
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-muted small mb-2">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {trip.destinations?.join(', ') || 'No destinations set'}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-primary">{trip.status}</span>
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
                  <i className="fas fa-calendar-plus fa-3x text-muted mb-3"></i>
                  <h6>No upcoming trips</h6>
                  <p className="text-muted">Start planning your next adventure!</p>
                  <Link to="/trips/create" className="btn btn-primary">
                    Plan Your First Trip
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Budget Overview */}
        <div className="col-lg-4 mb-4">
          <motion.div variants={itemVariants} className="card card-modern h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-pie me-2 text-success"></i>
                Budget Overview
              </h5>
            </div>
            <div className="card-body">
              {budgetBreakdown.planned > 0 ? (
                <>
                  <div className="chart-container mb-3" style={{ height: '200px' }}>
                    <Doughnut
                      data={budgetChartData}
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
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h6 className="text-success">${budgetBreakdown.spent?.toLocaleString() || 0}</h6>
                        <small className="text-muted">Spent</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h6 className="text-primary">${budgetBreakdown.remaining?.toLocaleString() || 0}</h6>
                      <small className="text-muted">Remaining</small>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-piggy-bank fa-3x text-muted mb-3"></i>
                  <h6>No budget data</h6>
                  <p className="text-muted small">Add budgets to your trips to see spending insights</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Popular Destinations */}
      {popularDestinations.length > 0 && (
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="fas fa-map-marked-alt me-2 text-warning"></i>
                  Your Favorite Destinations
                </h5>
              </div>
              <div className="card-body">
                <div className="chart-container" style={{ height: '300px' }}>
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
                  <Link to="/trips/create" className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-plus fa-2x mb-2"></i>
                    <span>Plan New Trip</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/public-trips" className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-search fa-2x mb-2"></i>
                    <span>Explore Trips</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/profile" className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-user fa-2x mb-2"></i>
                    <span>Edit Profile</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="fas fa-question-circle fa-2x mb-2"></i>
                    <span>Help & Support</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TravellerDashboard;
