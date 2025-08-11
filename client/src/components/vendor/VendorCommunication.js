import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorCommunication = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading messages..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-communication"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Communication Center</h4>
          <p className="text-muted mb-0">Manage customer messages and notifications</p>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          New Message
        </button>
      </div>

      <div className="text-center py-5">
        <i className="fas fa-comments fa-4x text-muted mb-3"></i>
        <h5 className="text-muted mb-3">Communication Center</h5>
        <p className="text-muted mb-4">
          Advanced messaging system coming soon...
        </p>
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          This feature will include real-time chat, automated responses, and message templates.
        </div>
      </div>
    </motion.div>
  );
};

export default VendorCommunication;
