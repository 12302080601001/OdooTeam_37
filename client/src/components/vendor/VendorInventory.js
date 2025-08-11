import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorInventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/inventory`);
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading inventory..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-inventory"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Inventory Management</h4>
          <p className="text-muted mb-0">Manage service availability, pricing, and capacity</p>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Add Inventory Item
        </button>
      </div>

      <div className="text-center py-5">
        <i className="fas fa-boxes fa-4x text-muted mb-3"></i>
        <h5 className="text-muted mb-3">Inventory Management</h5>
        <p className="text-muted mb-4">
          Advanced inventory management system coming soon...
        </p>
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          This feature will include availability calendars, dynamic pricing, and capacity management.
        </div>
      </div>
    </motion.div>
  );
};

export default VendorInventory;
