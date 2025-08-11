import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-reports"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Reports & Insights</h4>
          <p className="text-muted mb-0">Comprehensive business analytics and reporting</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline-primary">
            <i className="fas fa-download me-2"></i>
            Export Report
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Custom Report
          </button>
        </div>
      </div>

      {/* Report Categories */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-success mb-3">
                <i className="fas fa-dollar-sign fa-3x"></i>
              </div>
              <h5 className="card-title">Financial Reports</h5>
              <p className="card-text text-muted">Revenue, expenses, and profit analysis</p>
              <button className="btn btn-outline-success">
                View Reports
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-primary mb-3">
                <i className="fas fa-users fa-3x"></i>
              </div>
              <h5 className="card-title">Customer Reports</h5>
              <p className="card-text text-muted">Customer behavior and demographics</p>
              <button className="btn btn-outline-primary">
                View Reports
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-info mb-3">
                <i className="fas fa-chart-bar fa-3x"></i>
              </div>
              <h5 className="card-title">Performance Reports</h5>
              <p className="card-text text-muted">Service performance and trends</p>
              <button className="btn btn-outline-info">
                View Reports
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-3">
                <i className="fas fa-calendar-alt fa-3x"></i>
              </div>
              <h5 className="card-title">Booking Reports</h5>
              <p className="card-text text-muted">Booking patterns and forecasting</p>
              <button className="btn btn-outline-warning">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-5">
        <i className="fas fa-chart-pie fa-4x text-muted mb-3"></i>
        <h5 className="text-muted mb-3">Advanced Reporting Suite</h5>
        <p className="text-muted mb-4">
          Comprehensive business intelligence and reporting tools coming soon...
        </p>
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          This feature will include interactive dashboards, custom reports, and data export options.
        </div>
      </div>
    </motion.div>
  );
};

export default VendorReports;
