import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchTrips();
  }, [filters]);

  const fetchTrips = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/api/trips?${params}`);
      setTrips(response.data.trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-warning';
      case 'confirmed': return 'bg-info';
      case 'ongoing': return 'bg-success';
      case 'completed': return 'bg-secondary';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-primary';
    }
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

  if (loading) {
    return <LoadingSpinner text="Loading your trips..." />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-fluid"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="font-poppins mb-1">My Trips</h2>
              <p className="text-muted mb-0">Manage and view all your travel plans</p>
            </div>
            <Link to="/trips/create" className="btn btn-gradient btn-modern">
              <i className="fas fa-plus me-2"></i>
              Plan New Trip
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern">
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
                      placeholder="Search trips..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value="planning">Planning</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-filter me-1"></i>
                      More Filters
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="fas fa-download me-1"></i>
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <motion.div variants={itemVariants} className="row">
          {trips.map((trip, index) => (
            <div key={trip.id} className="col-lg-4 col-md-6 mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card card-modern h-100"
              >
                {trip.coverImage && (
                  <img 
                    src={trip.coverImage} 
                    className="card-img-top" 
                    alt={trip.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{trip.title}</h5>
                    <span className={`badge ${getStatusColor(trip.status)}`}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                  </div>
                  
                  {trip.description && (
                    <p className="card-text text-muted small mb-3">
                      {trip.description.length > 100 
                        ? `${trip.description.substring(0, 100)}...` 
                        : trip.description
                      }
                    </p>
                  )}

                  <div className="mb-3">
                    <div className="row text-center">
                      <div className="col-6">
                        <small className="text-muted d-block">Start Date</small>
                        <strong>{new Date(trip.startDate).toLocaleDateString()}</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">End Date</small>
                        <strong>{new Date(trip.endDate).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </div>

                  {trip.destinations && trip.destinations.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Destinations</small>
                      <div className="d-flex flex-wrap gap-1">
                        {trip.destinations.slice(0, 3).map((dest, idx) => (
                          <span key={idx} className="badge bg-light text-dark">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {dest}
                          </span>
                        ))}
                        {trip.destinations.length > 3 && (
                          <span className="badge bg-light text-dark">
                            +{trip.destinations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {trip.budget && (
                    <div className="mb-3">
                      <small className="text-muted d-block">Budget</small>
                      <strong className="text-success">
                        {trip.currency} {trip.budget.toLocaleString()}
                      </strong>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex gap-2">
                      <Link 
                        to={`/trips/${trip.id}`} 
                        className="btn btn-outline-primary btn-sm flex-fill"
                      >
                        <i className="fas fa-eye me-1"></i>
                        View
                      </Link>
                      <Link 
                        to={`/trips/${trip.id}/edit`} 
                        className="btn btn-outline-warning btn-sm flex-fill"
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit
                      </Link>
                      <button className="btn btn-outline-danger btn-sm">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  {trip.isPublic && (
                    <div className="mt-2 text-center">
                      <small className="text-success">
                        <i className="fas fa-globe me-1"></i>
                        Public Trip
                      </small>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="row">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-body text-center py-5">
                <i className="fas fa-suitcase fa-4x text-muted mb-4"></i>
                <h4>No trips found</h4>
                <p className="text-muted mb-4">
                  {filters.search || filters.status 
                    ? "No trips match your current filters. Try adjusting your search criteria."
                    : "You haven't planned any trips yet. Start your travel journey today!"
                  }
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/trips/create" className="btn btn-gradient btn-modern">
                    <i className="fas fa-plus me-2"></i>
                    Plan Your First Trip
                  </Link>
                  <Link to="/public-trips" className="btn btn-outline-primary btn-modern">
                    <i className="fas fa-search me-2"></i>
                    Explore Public Trips
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TripList;
