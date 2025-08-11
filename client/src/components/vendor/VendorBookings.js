import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}`, { status });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading bookings..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-bookings"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Bookings Management</h4>
          <p className="text-muted mb-0">Manage your service bookings and customer requests</p>
        </div>
        <div className="btn-group">
          <button
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fas fa-list me-1"></i>
            List View
          </button>
          <button
            className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('calendar')}
          >
            <i className="fas fa-calendar me-1"></i>
            Calendar View
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-calendar-check fa-2x"></i>
              </div>
              <h4 className="fw-bold">{bookings.length}</h4>
              <p className="text-muted mb-0">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="fas fa-clock fa-2x"></i>
              </div>
              <h4 className="fw-bold">{bookings.filter(b => b.status === 'pending').length}</h4>
              <p className="text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-check-circle fa-2x"></i>
              </div>
              <h4 className="fw-bold">{bookings.filter(b => b.status === 'confirmed').length}</h4>
              <p className="text-muted mb-0">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-dollar-sign fa-2x"></i>
              </div>
              <h4 className="fw-bold">
                ${bookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0).toLocaleString()}
              </h4>
              <p className="text-muted mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card card-modern mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="btn-group" role="group">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All ({bookings.length})
                </button>
                <button
                  className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending ({bookings.filter(b => b.status === 'pending').length})
                </button>
                <button
                  className={`btn ${filter === 'confirmed' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('confirmed')}
                >
                  Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                </button>
                <button
                  className={`btn ${filter === 'completed' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed ({bookings.filter(b => b.status === 'completed').length})
                </button>
                <button
                  className={`btn ${filter === 'cancelled' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {viewMode === 'list' && (
        <div className="card card-modern">
          <div className="card-body p-0">
            {filteredBookings.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Guests</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <span className="fw-bold text-primary">#{booking.id}</span>
                        </td>
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
                        <td>
                          <div>
                            <div className="fw-semibold">{booking.service?.title}</div>
                            <small className="text-muted">{booking.service?.category}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                            <small className="text-muted">{booking.bookingTime || 'All day'}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">{booking.guests || 1} guests</span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">${booking.totalAmount}</span>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  title="Confirm Booking"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  title="Cancel Booking"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                className="btn btn-outline-info"
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                title="Mark as Completed"
                              >
                                <i className="fas fa-flag-checkered"></i>
                              </button>
                            )}
                            <button className="btn btn-outline-primary" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-outline-secondary" title="Message Customer">
                              <i className="fas fa-comment"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-calendar-times fa-4x text-muted mb-3"></i>
                <h5 className="text-muted mb-3">No bookings found</h5>
                <p className="text-muted mb-4">
                  {filter !== 'all' 
                    ? `No ${filter} bookings at the moment`
                    : 'You haven\'t received any bookings yet'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="card card-modern">
          <div className="card-body">
            <div className="text-center py-5">
              <i className="fas fa-calendar-alt fa-4x text-muted mb-3"></i>
              <h5 className="text-muted mb-3">Calendar View</h5>
              <p className="text-muted mb-4">
                Interactive calendar view coming soon...
              </p>
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                Calendar integration will be implemented in the next update
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VendorBookings;
