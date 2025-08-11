import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sample trip data for demonstration
const sampleTrips = [
  {
    id: 1,
    title: "Magical Japan Adventure",
    destination: "Tokyo, Kyoto, Osaka",
    country: "Japan",
    duration: 14,
    price: 2850,
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    highlights: ["Cherry Blossoms", "Traditional Temples", "Modern Cities", "Authentic Cuisine"],
    type: "Cultural",
    difficulty: "Easy",
    groupSize: "2-12 people",
    description: "Experience the perfect blend of ancient traditions and modern innovation in Japan."
  },
  {
    id: 2,
    title: "Swiss Alps Hiking Expedition",
    destination: "Zermatt, Interlaken, Grindelwald",
    country: "Switzerland",
    duration: 10,
    price: 3200,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    highlights: ["Matterhorn Views", "Alpine Hiking", "Mountain Railways", "Swiss Villages"],
    type: "Adventure",
    difficulty: "Moderate",
    groupSize: "4-8 people",
    description: "Breathtaking mountain landscapes and world-class hiking trails await you."
  },
  {
    id: 3,
    title: "Bali Wellness Retreat",
    destination: "Ubud, Seminyak, Canggu",
    country: "Indonesia",
    duration: 7,
    price: 1450,
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
    highlights: ["Yoga Sessions", "Spa Treatments", "Rice Terraces", "Beach Relaxation"],
    type: "Wellness",
    difficulty: "Easy",
    groupSize: "1-6 people",
    description: "Rejuvenate your mind, body, and soul in tropical paradise."
  },
  {
    id: 4,
    title: "Iceland Northern Lights",
    destination: "Reykjavik, Golden Circle, South Coast",
    country: "Iceland",
    duration: 8,
    price: 2750,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop",
    highlights: ["Northern Lights", "Blue Lagoon", "Waterfalls", "Glaciers"],
    type: "Nature",
    difficulty: "Easy",
    groupSize: "2-10 people",
    description: "Witness the magical aurora borealis and Iceland's stunning natural wonders."
  },
  {
    id: 5,
    title: "Moroccan Desert Safari",
    destination: "Marrakech, Sahara, Fes",
    country: "Morocco",
    duration: 12,
    price: 1980,
    rating: 4.6,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop",
    highlights: ["Sahara Desert", "Camel Trekking", "Berber Culture", "Imperial Cities"],
    type: "Cultural",
    difficulty: "Moderate",
    groupSize: "4-12 people",
    description: "Immerse yourself in the exotic culture and landscapes of Morocco."
  },
  {
    id: 6,
    title: "New Zealand Adventure",
    destination: "Auckland, Queenstown, Milford Sound",
    country: "New Zealand",
    duration: 16,
    price: 4200,
    rating: 4.8,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    highlights: ["Fjords", "Bungee Jumping", "Hobbiton", "Adventure Sports"],
    type: "Adventure",
    difficulty: "Challenging",
    groupSize: "2-8 people",
    description: "The ultimate adventure playground with stunning landscapes and thrilling activities."
  }
];

const PublicTrips = () => {
  const [trips] = useState(sampleTrips);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  // Filter and sort trips
  const processedTrips = useMemo(() => {
    let filtered = trips.filter(trip => {
      const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || trip.type === selectedType;
      const matchesPrice = trip.price >= priceRange[0] && trip.price <= priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    });

    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.duration - b.duration;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return filtered;
  }, [trips, searchTerm, selectedType, priceRange, sortBy]);

  const tripTypes = ['All', 'Cultural', 'Adventure', 'Wellness', 'Nature'];

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-4 font-poppins fw-bold mb-4">
                  Explore Amazing <span className="text-warning">Trips</span>
                </h1>
                <p className="lead mb-4">
                  Discover handpicked travel experiences from around the world.
                  Find your next adventure and create unforgettable memories.
                </p>
                <div className="row text-center mt-5">
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="fw-bold">{trips.length}+</h3>
                    <small>Amazing Trips</small>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="fw-bold">50+</h3>
                    <small>Countries</small>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="fw-bold">4.8★</h3>
                    <small>Average Rating</small>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="fw-bold">1000+</h3>
                    <small>Happy Travelers</small>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-4" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card card-modern border-0 shadow-lg">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    {/* Search Bar */}
                    <div className="col-lg-4 col-md-6 mb-3">
                      <div className="position-relative">
                        <i className="fas fa-search position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
                        <input
                          type="text"
                          className="form-control form-control-lg ps-5"
                          placeholder="Search destinations, countries..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderRadius: '50px', border: '2px solid #e9ecef' }}
                        />
                      </div>
                    </div>

                    {/* Trip Type Filter */}
                    <div className="col-lg-2 col-md-6 mb-3">
                      <select
                        className="form-select form-select-lg"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={{ borderRadius: '15px', border: '2px solid #e9ecef' }}
                      >
                        {tripTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div className="col-lg-3 col-md-6 mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Price:</span>
                        <input
                          type="range"
                          className="form-range flex-grow-1"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        />
                        <span className="text-primary fw-bold small">${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="col-lg-2 col-md-6 mb-3">
                      <select
                        className="form-select form-select-lg"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ borderRadius: '15px', border: '2px solid #e9ecef' }}
                      >
                        <option value="rating">Best Rated</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="duration">Duration</option>
                        <option value="reviews">Most Reviewed</option>
                      </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="col-lg-1 col-md-6 mb-3">
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setViewMode('grid')}
                          title="Grid View"
                        >
                          <i className="fas fa-th"></i>
                        </button>
                        <button
                          type="button"
                          className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setViewMode('list')}
                          title="List View"
                        >
                          <i className="fas fa-list"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Summary */}
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                          Showing {processedTrips.length} of {trips.length} trips
                        </span>
                        <div className="d-flex gap-2">
                          {selectedType !== 'All' && (
                            <span className="badge bg-primary rounded-pill">
                              {selectedType}
                              <button
                                className="btn-close btn-close-white ms-2"
                                style={{ fontSize: '0.6rem' }}
                                onClick={() => setSelectedType('All')}
                              ></button>
                            </span>
                          )}
                          {searchTerm && (
                            <span className="badge bg-info rounded-pill">
                              "{searchTerm}"
                              <button
                                className="btn-close btn-close-white ms-2"
                                style={{ fontSize: '0.6rem' }}
                                onClick={() => setSearchTerm('')}
                              ></button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid Section */}
      <section className="py-5">
        <div className="container">
          {processedTrips.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-4x text-muted mb-4"></i>
              <h4 className="text-muted">No trips found</h4>
              <p className="text-muted">Try adjusting your search criteria or filters</p>
              <button
                className="btn btn-primary btn-modern"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('All');
                  setPriceRange([0, 5000]);
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <div className={`row ${viewMode === 'grid' ? 'row-cols-1 row-cols-md-2 row-cols-lg-3' : ''}`}>
                {processedTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    className={viewMode === 'grid' ? 'col mb-4' : 'col-12 mb-4'}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={`card card-modern h-100 overflow-hidden ${viewMode === 'list' ? 'card-horizontal' : ''}`}>
                      {viewMode === 'grid' ? (
                        // Grid View Card
                        <>
                          <div className="position-relative overflow-hidden">
                            <img
                              src={trip.image}
                              className="card-img-top"
                              alt={trip.title}
                              style={{ height: '250px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                            <div className="position-absolute top-0 end-0 m-3">
                              <span className="badge bg-primary rounded-pill px-3 py-2">
                                {trip.type}
                              </span>
                            </div>
                            <div className="position-absolute bottom-0 start-0 m-3">
                              <span className="badge bg-dark bg-opacity-75 rounded-pill px-3 py-2">
                                <i className="fas fa-clock me-1"></i>
                                {trip.duration} days
                              </span>
                            </div>
                          </div>
                          <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title fw-bold mb-0">{trip.title}</h5>
                              <div className="text-end">
                                <div className="text-warning mb-1">
                                  {'★'.repeat(Math.floor(trip.rating))}
                                  <span className="text-muted ms-1">({trip.reviews})</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted mb-2">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {trip.destination}
                            </p>
                            <p className="card-text text-muted small mb-3">{trip.description}</p>

                            {/* Highlights */}
                            <div className="mb-3">
                              <div className="d-flex flex-wrap gap-1">
                                {trip.highlights.slice(0, 3).map((highlight, idx) => (
                                  <span key={idx} className="badge bg-light text-dark rounded-pill small">
                                    {highlight}
                                  </span>
                                ))}
                                {trip.highlights.length > 3 && (
                                  <span className="badge bg-light text-dark rounded-pill small">
                                    +{trip.highlights.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className="h4 text-primary fw-bold">${trip.price}</span>
                                <small className="text-muted"> per person</small>
                              </div>
                              <div className="d-flex gap-2">
                                <button className="btn btn-outline-primary btn-sm">
                                  <i className="fas fa-heart"></i>
                                </button>
                                <Link to={`/trips/${trip.id}`} className="btn btn-primary btn-sm">
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        // List View Card
                        <div className="row g-0">
                          <div className="col-md-4">
                            <img
                              src={trip.image}
                              className="img-fluid h-100"
                              alt={trip.title}
                              style={{ objectFit: 'cover', minHeight: '200px' }}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h5 className="card-title fw-bold">{trip.title}</h5>
                                  <p className="text-muted mb-2">
                                    <i className="fas fa-map-marker-alt me-1"></i>
                                    {trip.destination}
                                  </p>
                                </div>
                                <div className="text-end">
                                  <span className="h4 text-primary fw-bold">${trip.price}</span>
                                  <div className="text-warning">
                                    {'★'.repeat(Math.floor(trip.rating))}
                                    <span className="text-muted ms-1">({trip.reviews})</span>
                                  </div>
                                </div>
                              </div>
                              <p className="card-text mb-3">{trip.description}</p>
                              <div className="d-flex flex-wrap gap-2 mb-3">
                                <span className="badge bg-primary rounded-pill">{trip.type}</span>
                                <span className="badge bg-secondary rounded-pill">
                                  <i className="fas fa-clock me-1"></i>
                                  {trip.duration} days
                                </span>
                                <span className="badge bg-info rounded-pill">
                                  <i className="fas fa-users me-1"></i>
                                  {trip.groupSize}
                                </span>
                                <span className="badge bg-success rounded-pill">
                                  {trip.difficulty}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-wrap gap-1">
                                  {trip.highlights.slice(0, 4).map((highlight, idx) => (
                                    <span key={idx} className="badge bg-light text-dark rounded-pill small">
                                      {highlight}
                                    </span>
                                  ))}
                                </div>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-outline-primary btn-sm">
                                    <i className="fas fa-heart"></i>
                                  </button>
                                  <Link to={`/trips/${trip.id}`} className="btn btn-primary btn-sm">
                                    View Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="gradient-bg-secondary text-white py-5">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins fw-bold mb-4">Ready to Start Your Adventure?</h2>
            <p className="lead mb-4">Join thousands of travelers who have discovered their perfect trip with us</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn btn-light btn-lg btn-modern">
                <i className="fas fa-user-plus me-2"></i>
                Sign Up Now
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg btn-modern">
                <i className="fas fa-sign-in-alt me-2"></i>
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PublicTrips;
