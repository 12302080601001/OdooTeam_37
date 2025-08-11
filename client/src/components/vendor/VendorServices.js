import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorServices = () => {
  return (
    <Routes>
      <Route index element={<ServicesList />} />
      <Route path="create" element={<CreateService />} />
      <Route path=":id" element={<ServiceDetail />} />
      <Route path=":id/edit" element={<EditService />} />
    </Routes>
  );
};

const ServicesList = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && service.isActive) ||
      (filter === 'inactive' && !service.isActive);
    
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Loading services..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="services-list"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">My Services</h4>
          <p className="text-muted mb-0">Manage your travel services and offerings</p>
        </div>
        <Link to="/vendor/services/create" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Add New Service
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card card-modern mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All ({services.length})
                </button>
                <button
                  className={`btn ${filter === 'active' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('active')}
                >
                  Active ({services.filter(s => s.isActive).length})
                </button>
                <button
                  className={`btn ${filter === 'inactive' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('inactive')}
                >
                  Inactive ({services.filter(s => !s.isActive).length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="row">
          {filteredServices.map((service) => (
            <div key={service.id} className="col-lg-4 col-md-6 mb-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="card card-modern h-100 border-0 shadow-sm"
              >
                <div className="position-relative">
                  <img
                    src={service.images?.[0] || '/api/placeholder/300/200'}
                    alt={service.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className={`badge ${service.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {service.isFeatured && (
                    <div className="position-absolute top-0 start-0 p-2">
                      <span className="badge bg-warning">
                        <i className="fas fa-star me-1"></i>
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{service.title}</h6>
                    <span className="badge bg-primary">{service.category}</span>
                  </div>
                  
                  <p className="card-text text-muted small mb-3">
                    {service.description?.substring(0, 100)}...
                  </p>
                  
                  <div className="row text-center mb-3">
                    <div className="col-4">
                      <div className="text-primary fw-bold">${service.price}</div>
                      <small className="text-muted">{service.priceType}</small>
                    </div>
                    <div className="col-4">
                      <div className="text-warning fw-bold">
                        <i className="fas fa-star me-1"></i>
                        {service.rating?.toFixed(1) || 'N/A'}
                      </div>
                      <small className="text-muted">{service.reviewCount} reviews</small>
                    </div>
                    <div className="col-4">
                      <div className="text-info fw-bold">{service.bookings || 0}</div>
                      <small className="text-muted">bookings</small>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer bg-transparent border-0">
                  <div className="btn-group w-100">
                    <Link
                      to={`/vendor/services/${service.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="fas fa-eye me-1"></i>
                      View
                    </Link>
                    <Link
                      to={`/vendor/services/${service.id}/edit`}
                      className="btn btn-outline-warning btn-sm"
                    >
                      <i className="fas fa-edit me-1"></i>
                      Edit
                    </Link>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => toggleServiceStatus(service.id, !service.isActive)}
                    >
                      <i className={`fas fa-${service.isActive ? 'pause' : 'play'} me-1`}></i>
                      {service.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-concierge-bell fa-4x text-muted mb-3"></i>
          <h5 className="text-muted mb-3">No services found</h5>
          <p className="text-muted mb-4">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first service to attract customers'
            }
          </p>
          <Link to="/vendor/services/create" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Add Your First Service
          </Link>
        </div>
      )}
    </motion.div>
  );

  async function toggleServiceStatus(serviceId, isActive) {
    try {
      await axios.patch(`/api/vendors/services/${serviceId}`, { isActive });
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  }
};

const CreateService = () => {
  return (
    <div className="create-service">
      <h4>Create New Service</h4>
      <p className="text-muted">Add a new service to your offerings</p>
      {/* Service creation form will be implemented here */}
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Service creation form coming soon...
      </div>
    </div>
  );
};

const ServiceDetail = () => {
  return (
    <div className="service-detail">
      <h4>Service Details</h4>
      <p className="text-muted">View detailed information about your service</p>
      {/* Service detail view will be implemented here */}
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Service detail view coming soon...
      </div>
    </div>
  );
};

const EditService = () => {
  return (
    <div className="edit-service">
      <h4>Edit Service</h4>
      <p className="text-muted">Update your service information</p>
      {/* Service edit form will be implemented here */}
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Service edit form coming soon...
      </div>
    </div>
  );
};

export default VendorServices;
