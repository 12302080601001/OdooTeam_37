import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorRevenue = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/revenue?range=${timeRange}`);
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading revenue analytics..." />;
  }

  const {
    totalRevenue = 0,
    revenueGrowth = 0,
    totalBookings = 0,
    bookingGrowth = 0,
    averageOrderValue = 0,
    aovGrowth = 0,
    conversionRate = 0,
    conversionGrowth = 0,
    monthlyRevenue = [],
    topServices = [],
    revenueByCategory = []
  } = revenueData || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-revenue"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Revenue Analytics</h4>
          <p className="text-muted mb-0">Track your earnings and business performance</p>
        </div>
        <div className="btn-group">
          <button
            className={`btn ${timeRange === '7days' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('7days')}
          >
            7 Days
          </button>
          <button
            className={`btn ${timeRange === '30days' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('30days')}
          >
            30 Days
          </button>
          <button
            className={`btn ${timeRange === '90days' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('90days')}
          >
            90 Days
          </button>
          <button
            className={`btn ${timeRange === '1year' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('1year')}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <motion.div
            whileHover={{ y: -5 }}
            className="card card-modern border-0 shadow-sm h-100"
          >
            <div className="card-body text-center">
              <div className="text-success mb-3">
                <i className="fas fa-dollar-sign fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-muted mb-2">Total Revenue</p>
              <div className={`small ${revenueGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                <i className={`fas fa-arrow-${revenueGrowth >= 0 ? 'up' : 'down'} me-1`}></i>
                {Math.abs(revenueGrowth)}% vs last period
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <motion.div
            whileHover={{ y: -5 }}
            className="card card-modern border-0 shadow-sm h-100"
          >
            <div className="card-body text-center">
              <div className="text-primary mb-3">
                <i className="fas fa-calendar-check fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">{totalBookings}</h3>
              <p className="text-muted mb-2">Total Bookings</p>
              <div className={`small ${bookingGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                <i className={`fas fa-arrow-${bookingGrowth >= 0 ? 'up' : 'down'} me-1`}></i>
                {Math.abs(bookingGrowth)}% vs last period
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <motion.div
            whileHover={{ y: -5 }}
            className="card card-modern border-0 shadow-sm h-100"
          >
            <div className="card-body text-center">
              <div className="text-info mb-3">
                <i className="fas fa-chart-line fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">${averageOrderValue}</h3>
              <p className="text-muted mb-2">Avg. Order Value</p>
              <div className={`small ${aovGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                <i className={`fas fa-arrow-${aovGrowth >= 0 ? 'up' : 'down'} me-1`}></i>
                {Math.abs(aovGrowth)}% vs last period
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <motion.div
            whileHover={{ y: -5 }}
            className="card card-modern border-0 shadow-sm h-100"
          >
            <div className="card-body text-center">
              <div className="text-warning mb-3">
                <i className="fas fa-percentage fa-3x"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">{conversionRate}%</h3>
              <p className="text-muted mb-2">Conversion Rate</p>
              <div className={`small ${conversionGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                <i className={`fas fa-arrow-${conversionGrowth >= 0 ? 'up' : 'down'} me-1`}></i>
                {Math.abs(conversionGrowth)}% vs last period
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="row">
        {/* Revenue Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-chart-area me-2 text-primary"></i>
                  Revenue Trend
                </h5>
                <div className="btn-group btn-group-sm">
                  <button
                    className={`btn ${selectedMetric === 'revenue' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric('revenue')}
                  >
                    Revenue
                  </button>
                  <button
                    className={`btn ${selectedMetric === 'bookings' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric('bookings')}
                  >
                    Bookings
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <i className="fas fa-chart-line fa-4x text-muted mb-3"></i>
                <h5 className="text-muted mb-3">Interactive Chart</h5>
                <p className="text-muted mb-4">
                  Revenue trend chart will be implemented with Chart.js or similar library
                </p>
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Chart integration coming soon...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="col-lg-4 mb-4">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-trophy me-2 text-warning"></i>
                Top Performing Services
              </h5>
            </div>
            <div className="card-body">
              {topServices.length > 0 ? (
                <div className="list-group list-group-flush">
                  {topServices.map((service, index) => (
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
                              {service.bookings} bookings
                            </small>
                            <small className="text-success fw-bold">
                              ${service.revenue?.toLocaleString()}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Revenue by Category */}
        <div className="col-lg-6 mb-4">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-pie-chart me-2 text-info"></i>
                Revenue by Category
              </h5>
            </div>
            <div className="card-body">
              {revenueByCategory.length > 0 ? (
                <div className="row">
                  {revenueByCategory.map((category, index) => (
                    <div key={category.name} className="col-12 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold">{category.name}</span>
                        <span className="text-success fw-bold">${category.revenue?.toLocaleString()}</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className={`progress-bar bg-${['primary', 'success', 'info', 'warning', 'danger'][index % 5]}`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">{category.percentage}% of total revenue</small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No category data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-lg-6 mb-4">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-receipt me-2 text-success"></i>
                  Recent Transactions
                </h5>
                <button className="btn btn-outline-primary btn-sm">
                  View All
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="text-center py-4">
                <i className="fas fa-credit-card fa-3x text-muted mb-3"></i>
                <p className="text-muted">Recent transactions will be displayed here</p>
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Transaction history coming soon...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="row">
        <div className="col-12">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Export Revenue Data</h5>
                  <p className="text-muted mb-0">Download your revenue reports for accounting and analysis</p>
                </div>
                <div className="btn-group">
                  <button className="btn btn-outline-success">
                    <i className="fas fa-file-excel me-2"></i>
                    Export to Excel
                  </button>
                  <button className="btn btn-outline-danger">
                    <i className="fas fa-file-pdf me-2"></i>
                    Export to PDF
                  </button>
                  <button className="btn btn-outline-primary">
                    <i className="fas fa-file-csv me-2"></i>
                    Export to CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VendorRevenue;
