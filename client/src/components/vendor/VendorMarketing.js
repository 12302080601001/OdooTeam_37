import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorMarketing = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/marketing`);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading marketing tools..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-marketing"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Marketing Tools</h4>
          <p className="text-muted mb-0">Promote your services and attract more customers</p>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-bullhorn me-2"></i>
          Create Campaign
        </button>
      </div>

      {/* Marketing Tools Grid */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-primary mb-3">
                <i className="fas fa-percentage fa-3x"></i>
              </div>
              <h5 className="card-title">Discounts & Offers</h5>
              <p className="card-text text-muted">Create special offers and discount codes</p>
              <button className="btn btn-outline-primary">
                Create Offer
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-success mb-3">
                <i className="fas fa-star fa-3x"></i>
              </div>
              <h5 className="card-title">Featured Listings</h5>
              <p className="card-text text-muted">Boost visibility with featured placement</p>
              <button className="btn btn-outline-success">
                Feature Service
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-info mb-3">
                <i className="fas fa-share-alt fa-3x"></i>
              </div>
              <h5 className="card-title">Social Media</h5>
              <p className="card-text text-muted">Share your services on social platforms</p>
              <button className="btn btn-outline-info">
                Share Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-3">
                <i className="fas fa-chart-line fa-3x"></i>
              </div>
              <h5 className="card-title">Analytics</h5>
              <p className="card-text text-muted">Track your marketing performance</p>
              <button className="btn btn-outline-warning">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-5">
        <i className="fas fa-bullhorn fa-4x text-muted mb-3"></i>
        <h5 className="text-muted mb-3">Advanced Marketing Tools</h5>
        <p className="text-muted mb-4">
          Comprehensive marketing suite coming soon...
        </p>
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          This feature will include email campaigns, SEO tools, and performance tracking.
        </div>
      </div>
    </motion.div>
  );
};

export default VendorMarketing;
