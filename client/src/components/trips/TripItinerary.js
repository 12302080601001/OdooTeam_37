import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const TripItinerary = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      const response = await axios.get(`/api/trips/${tripId}`);
      const tripData = response.data.trip;

      if (!tripData) {
        toast.error('Trip not found');
        return;
      }

      // Also fetch activities and destinations for this trip
      const activitiesResponse = await axios.get(`/api/trips/${tripId}/activities`);
      const destinationsResponse = await axios.get(`/api/trips/${tripId}/destinations`);
      const citiesResponse = await axios.get('/api/cities');

      tripData.activities = activitiesResponse.data.activities || [];
      tripData.destinations = destinationsResponse.data.destinations || [];
      setCities(citiesResponse.data.cities || []);

      setTrip(tripData);
    } catch (error) {
      console.error('Error fetching trip data:', error);
      toast.error('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Trip not found
        </div>
      </div>
    );
  }

  // Generate trip days
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDays = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    tripDays.push(new Date(d));
  }

  // Group activities by date
  const activitiesByDate = {};
  (trip.activities || []).forEach(activity => {
    const activityDate = activity.date || trip.startDate;
    if (!activitiesByDate[activityDate]) {
      activitiesByDate[activityDate] = [];
    }
    activitiesByDate[activityDate].push(activity);
  });

  // Sort activities by time within each day
  Object.keys(activitiesByDate).forEach(date => {
    activitiesByDate[date].sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  });

  // Group destinations by city
  const destinationsByCity = {};
  (trip.destinations || []).forEach(destination => {
    const city = cities.find(c => c.id === destination.cityId);
    if (city) {
      if (!destinationsByCity[city.name]) {
        destinationsByCity[city.name] = {
          city,
          destinations: []
        };
      }
      destinationsByCity[city.name].destinations.push(destination);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      sightseeing: 'fas fa-camera',
      culture: 'fas fa-university',
      food: 'fas fa-utensils',
      adventure: 'fas fa-mountain',
      entertainment: 'fas fa-music',
      shopping: 'fas fa-shopping-bag',
      nature: 'fas fa-tree',
      sports: 'fas fa-futbol'
    };
    return icons[category] || 'fas fa-calendar';
  };

  const getCategoryColor = (category) => {
    const colors = {
      sightseeing: '#3b82f6',
      culture: '#8b5cf6',
      food: '#ef4444',
      adventure: '#10b981',
      entertainment: '#f59e0b',
      shopping: '#ec4899',
      nature: '#059669',
      sports: '#dc2626'
    };
    return colors[category] || '#6b7280';
  };

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
              <h2 className="font-poppins mb-1">
                <i className="fas fa-calendar-alt me-2 text-primary"></i>
                Trip Itinerary
              </h2>
              <p className="text-muted mb-0">{trip.title}</p>
              <small className="text-muted">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                ({tripDays.length} days)
              </small>
            </div>
            <div className="d-flex gap-2">
              {/* View Mode Toggle */}
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${viewMode === 'timeline' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('timeline')}
                >
                  <i className="fas fa-timeline me-1"></i>
                  Timeline
                </button>
                <button
                  type="button"
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list me-1"></i>
                  List
                </button>
              </div>

              <Link to={`/trips/${tripId}/activities`} className="btn btn-success btn-modern">
                <i className="fas fa-plus me-2"></i>
                Add Activities
              </Link>

              <Link to={`/trips/${tripId}`} className="btn btn-outline-secondary btn-modern">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Trip
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trip Overview */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="text-center">
                    <i className="fas fa-map-marked-alt fa-2x text-primary mb-2"></i>
                    <h6>Destinations</h6>
                    <span className="badge bg-primary fs-6">
                      {Object.keys(destinationsByCity).length} Cities
                    </span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <i className="fas fa-calendar-check fa-2x text-success mb-2"></i>
                    <h6>Activities</h6>
                    <span className="badge bg-success fs-6">
                      {(trip.activities || []).length} Planned
                    </span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <i className="fas fa-clock fa-2x text-info mb-2"></i>
                    <h6>Duration</h6>
                    <span className="badge bg-info fs-6">
                      {tripDays.length} Days
                    </span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <i className="fas fa-dollar-sign fa-2x text-warning mb-2"></i>
                    <h6>Budget</h6>
                    <span className="badge bg-warning fs-6">
                      {trip.currency} {(trip.budget || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Destinations Overview */}
      {Object.keys(destinationsByCity).length > 0 && (
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Destinations
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.values(destinationsByCity).map((cityData, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-3">
                      <div className="border rounded p-3">
                        <div className="d-flex align-items-center mb-2">
                          <img
                            src={cityData.city.image}
                            alt={cityData.city.name}
                            className="rounded me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="mb-0">{cityData.city.name}</h6>
                            <small className="text-muted">{cityData.city.country}</small>
                          </div>
                        </div>
                        {cityData.destinations.map(dest => (
                          <div key={dest.id} className="mb-2">
                            <small className="text-muted">
                              <i className="fas fa-calendar me-1"></i>
                              {new Date(dest.arrivalDate).toLocaleDateString()} - {new Date(dest.departureDate).toLocaleDateString()}
                            </small>
                            {dest.accommodation && (
                              <div>
                                <small className="text-muted">
                                  <i className="fas fa-bed me-1"></i>
                                  {dest.accommodation}
                                </small>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Itinerary Content */}
      {viewMode === 'timeline' ? (
        /* Timeline View */
        <motion.div variants={itemVariants} className="row">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-timeline me-2"></i>
                  Daily Timeline
                </h5>
              </div>
              <div className="card-body">
                {tripDays.length > 0 ? (
                  <div className="timeline">
                    {tripDays.map((day, dayIndex) => {
                      const dayString = day.toISOString().split('T')[0];
                      const dayActivities = activitiesByDate[dayString] || [];
                      const isToday = day.toDateString() === new Date().toDateString();

                      return (
                        <div key={dayIndex} className="timeline-item mb-4">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-4">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center ${isToday ? 'bg-primary' : 'bg-secondary'}`} style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-calendar-day text-white"></i>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-0">
                                        Day {dayIndex + 1} - {day.toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </h6>
                                      {isToday && <small className="text-primary fw-bold">Today</small>}
                                    </div>
                                    <span className="badge bg-primary">
                                      {dayActivities.length} Activities
                                    </span>
                                  </div>
                                </div>
                                <div className="card-body">
                                  {dayActivities.length > 0 ? (
                                    <div className="row">
                                      {dayActivities.map((activity, actIndex) => (
                                        <div key={actIndex} className="col-md-6 mb-3">
                                          <div className="border rounded p-3 h-100">
                                            <div className="d-flex align-items-start">
                                              <div
                                                className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                style={{
                                                  width: '40px',
                                                  height: '40px',
                                                  backgroundColor: getCategoryColor(activity.category) + '20',
                                                  color: getCategoryColor(activity.category)
                                                }}
                                              >
                                                <i className={getCategoryIcon(activity.category)}></i>
                                              </div>
                                              <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                  <h6 className="mb-0">{activity.name}</h6>
                                                  {activity.time && (
                                                    <small className="text-muted fw-bold">
                                                      {formatTime(activity.time)}
                                                    </small>
                                                  )}
                                                </div>
                                                <p className="text-muted small mb-2">
                                                  {activity.description}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                  <span className="badge bg-light text-dark">
                                                    {activity.category}
                                                  </span>
                                                  <div className="d-flex gap-2">
                                                    {activity.duration && (
                                                      <small className="text-muted">
                                                        <i className="fas fa-clock me-1"></i>
                                                        {activity.duration}h
                                                      </small>
                                                    )}
                                                    {activity.cost && (
                                                      <small className="text-success fw-bold">
                                                        {trip.currency} {activity.cost}
                                                      </small>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-4">
                                      <i className="fas fa-calendar-plus fa-2x text-muted mb-2"></i>
                                      <p className="text-muted mb-0">No activities planned for this day</p>
                                      <Link
                                        to={`/trips/${tripId}/activities`}
                                        className="btn btn-sm btn-outline-primary mt-2"
                                      >
                                        <i className="fas fa-plus me-1"></i>
                                        Add Activities
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No trip dates set</h5>
                    <p className="text-muted">Please set your trip start and end dates to view the itinerary.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* List View */
        <motion.div variants={itemVariants} className="row">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-list me-2"></i>
                  Activities List
                </h5>
              </div>
              <div className="card-body">
                {(trip.activities || []).length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Activity</th>
                          <th>Category</th>
                          <th>Duration</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(trip.activities || [])
                          .sort((a, b) => {
                            const dateA = new Date(a.date || trip.startDate);
                            const dateB = new Date(b.date || trip.startDate);
                            if (dateA.getTime() !== dateB.getTime()) {
                              return dateA - dateB;
                            }
                            return (a.time || '00:00').localeCompare(b.time || '00:00');
                          })
                          .map((activity, index) => (
                            <tr key={index}>
                              <td>
                                {new Date(activity.date || trip.startDate).toLocaleDateString()}
                              </td>
                              <td>
                                {activity.time ? formatTime(activity.time) : '-'}
                              </td>
                              <td>
                                <div>
                                  <strong>{activity.name}</strong>
                                  {activity.description && (
                                    <div>
                                      <small className="text-muted">{activity.description}</small>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: getCategoryColor(activity.category) + '20',
                                    color: getCategoryColor(activity.category)
                                  }}
                                >
                                  <i className={`${getCategoryIcon(activity.category)} me-1`}></i>
                                  {activity.category}
                                </span>
                              </td>
                              <td>
                                {activity.duration ? `${activity.duration}h` : '-'}
                              </td>
                              <td>
                                {activity.cost ? (
                                  <span className="fw-bold text-success">
                                    {trip.currency} {activity.cost}
                                  </span>
                                ) : '-'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-list-alt fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No activities planned yet</h5>
                    <p className="text-muted">Start building your itinerary by adding activities to your trip.</p>
                    <Link
                      to={`/trips/${tripId}/activities`}
                      className="btn btn-primary btn-modern"
                    >
                      <i className="fas fa-plus me-2"></i>
                      Browse Activities
                    </Link>
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

export default TripItinerary;
