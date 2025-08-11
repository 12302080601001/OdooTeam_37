import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample cities data with comprehensive information
const sampleCities = [
  {
    id: 1,
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    costIndex: 85,
    popularity: 95,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop",
    description: "Modern metropolis blending tradition with innovation",
    averageCost: 150,
    currency: "USD",
    highlights: ["Temples", "Technology", "Cuisine", "Culture"],
    bestTime: "March-May, September-November",
    timezone: "JST (UTC+9)"
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    region: "Europe",
    costIndex: 78,
    popularity: 98,
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop",
    description: "City of Light with romantic charm and rich history",
    averageCost: 120,
    currency: "USD",
    highlights: ["Art", "Architecture", "Cuisine", "Romance"],
    bestTime: "April-June, September-October",
    timezone: "CET (UTC+1)"
  },
  {
    id: 3,
    name: "New York",
    country: "United States",
    region: "North America",
    costIndex: 82,
    popularity: 92,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop",
    description: "The city that never sleeps, full of energy and opportunities",
    averageCost: 180,
    currency: "USD",
    highlights: ["Broadway", "Museums", "Skyline", "Diversity"],
    bestTime: "April-June, September-November",
    timezone: "EST (UTC-5)"
  },
  {
    id: 4,
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    costIndex: 80,
    popularity: 90,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop",
    description: "Historic capital with royal heritage and modern culture",
    averageCost: 140,
    currency: "USD",
    highlights: ["History", "Royalty", "Museums", "Pubs"],
    bestTime: "May-September",
    timezone: "GMT (UTC+0)"
  },
  {
    id: 5,
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    costIndex: 75,
    popularity: 88,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop",
    description: "Futuristic city with luxury shopping and stunning architecture",
    averageCost: 160,
    currency: "USD",
    highlights: ["Luxury", "Shopping", "Architecture", "Desert"],
    bestTime: "November-March",
    timezone: "GST (UTC+4)"
  },
  {
    id: 6,
    name: "Sydney",
    country: "Australia",
    region: "Oceania",
    costIndex: 77,
    popularity: 85,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    description: "Harbor city with iconic landmarks and beautiful beaches",
    averageCost: 130,
    currency: "USD",
    highlights: ["Harbor", "Beaches", "Opera House", "Wildlife"],
    bestTime: "September-November, March-May",
    timezone: "AEST (UTC+10)"
  },
  {
    id: 7,
    name: "Bangkok",
    country: "Thailand",
    region: "Asia",
    costIndex: 45,
    popularity: 87,
    image: "https://images.unsplash.com/photo-1563492065-1a83e8c2b2e8?w=300&h=200&fit=crop",
    description: "Vibrant city with temples, street food, and bustling markets",
    averageCost: 60,
    currency: "USD",
    highlights: ["Temples", "Street Food", "Markets", "Culture"],
    bestTime: "November-February",
    timezone: "ICT (UTC+7)"
  },
  {
    id: 8,
    name: "Rome",
    country: "Italy",
    region: "Europe",
    costIndex: 70,
    popularity: 93,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop",
    description: "Eternal city with ancient history and incredible cuisine",
    averageCost: 110,
    currency: "USD",
    highlights: ["History", "Architecture", "Cuisine", "Art"],
    bestTime: "April-June, September-October",
    timezone: "CET (UTC+1)"
  }
];

const CitySearch = ({ onCitySelect, selectedCities = [], showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [costRange, setCostRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');

  // Get unique regions
  const regions = ['All', ...new Set(sampleCities.map(city => city.region))];

  // Filter and sort cities
  const filteredCities = useMemo(() => {
    let filtered = sampleCities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
      const matchesCost = city.averageCost >= costRange[0] && city.averageCost <= costRange[1];

      return matchesSearch && matchesRegion && matchesCost;
    });

    // Sort cities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'cost-low':
          return a.averageCost - b.averageCost;
        case 'cost-high':
          return b.averageCost - a.averageCost;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedRegion, costRange, sortBy]);

  const handleCitySelect = (city) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  const isCitySelected = (cityId) => {
    return selectedCities.some(city => city.id === cityId);
  };

  return (
    <div className="city-search">
      {/* Search Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card card-modern">
            <div className="card-body p-4">
              <div className="row align-items-center">
                {/* Search Bar */}
                <div className="col-lg-4 col-md-6 mb-3">
                  <div className="position-relative">
                    <i className="fas fa-search position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5"
                      placeholder="Search cities, countries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ borderRadius: '50px', border: '2px solid #e9ecef' }}
                    />
                  </div>
                </div>

                {/* Region Filter */}
                <div className="col-lg-2 col-md-6 mb-3">
                  <select
                    className="form-select form-select-lg"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    style={{ borderRadius: '15px', border: '2px solid #e9ecef' }}
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Cost Range */}
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small">Cost/day:</span>
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="0"
                      max="200"
                      step="10"
                      value={costRange[1]}
                      onChange={(e) => setCostRange([0, parseInt(e.target.value)])}
                    />
                    <span className="text-primary fw-bold small">${costRange[1]}</span>
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
                    <option value="popularity">Most Popular</option>
                    <option value="cost-low">Cost: Low to High</option>
                    <option value="cost-high">Cost: High to Low</option>
                    <option value="name">Name A-Z</option>
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
                      Showing {filteredCities.length} of {sampleCities.length} cities
                    </span>
                    <div className="d-flex gap-2">
                      {selectedRegion !== 'All' && (
                        <span className="badge bg-primary rounded-pill">
                          {selectedRegion}
                          <button
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.6rem' }}
                            onClick={() => setSelectedRegion('All')}
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

                {/* Cities Grid */}
                <div className="row">
                  {filteredCities.length === 0 ? (
                    <div className="col-12">
                      <div className="text-center py-5">
                        <i className="fas fa-search fa-4x text-muted mb-4"></i>
                        <h4 className="text-muted">No cities found</h4>
                        <p className="text-muted">Try adjusting your search criteria or filters</p>
                        <button
                          className="btn btn-primary btn-modern"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedRegion('All');
                            setCostRange([0, 200]);
                          }}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      <div className={`row ${viewMode === 'grid' ? 'row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4' : ''}`}>
                        {filteredCities.map((city, index) => (
                          <motion.div
                            key={city.id}
                            className={viewMode === 'grid' ? 'col mb-4' : 'col-12 mb-3'}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                          >
                            <div className={`card card-modern h-100 overflow-hidden ${viewMode === 'list' ? 'card-horizontal' : ''} ${isCitySelected(city.id) ? 'border-success' : ''}`}>
                              {viewMode === 'grid' ? (
                                // Grid View Card
                                <>
                                  <div className="position-relative overflow-hidden">
                                    <img
                                      src={city.image}
                                      className="card-img-top"
                                      alt={city.name}
                                      style={{ height: '200px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    <div className="position-absolute top-0 end-0 m-2">
                                      <span className="badge bg-primary rounded-pill px-2 py-1">
                                        {city.region}
                                      </span>
                                    </div>
                                    <div className="position-absolute bottom-0 start-0 m-2">
                                      <span className="badge bg-dark bg-opacity-75 rounded-pill px-2 py-1">
                                        <i className="fas fa-star me-1 text-warning"></i>
                                        {city.popularity}
                                      </span>
                                    </div>
                                    {isCitySelected(city.id) && (
                                      <div className="position-absolute top-0 start-0 m-2">
                                        <span className="badge bg-success rounded-pill px-2 py-1">
                                          <i className="fas fa-check me-1"></i>
                                          Added
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <div>
                                        <h5 className="card-title fw-bold mb-1">{city.name}</h5>
                                        <p className="text-muted small mb-0">
                                          <i className="fas fa-map-marker-alt me-1"></i>
                                          {city.country}
                                        </p>
                                      </div>
                                      <div className="text-end">
                                        <div className="text-success fw-bold">${city.averageCost}</div>
                                        <small className="text-muted">per day</small>
                                      </div>
                                    </div>

                                    <p className="card-text text-muted small mb-3">{city.description}</p>

                                    {/* Cost Index Bar */}
                                    <div className="mb-3">
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted">Cost Index</small>
                                        <small className="fw-bold">{city.costIndex}/100</small>
                                      </div>
                                      <div className="progress" style={{ height: '4px' }}>
                                        <div
                                          className={`progress-bar ${city.costIndex > 80 ? 'bg-danger' : city.costIndex > 60 ? 'bg-warning' : 'bg-success'}`}
                                          style={{ width: `${city.costIndex}%` }}
                                        ></div>
                                      </div>
                                    </div>

                                    {/* Highlights */}
                                    <div className="mb-3">
                                      <div className="d-flex flex-wrap gap-1">
                                        {city.highlights.slice(0, 3).map((highlight, idx) => (
                                          <span key={idx} className="badge bg-light text-dark rounded-pill small">
                                            {highlight}
                                          </span>
                                        ))}
                                        {city.highlights.length > 3 && (
                                          <span className="badge bg-light text-dark rounded-pill small">
                                            +{city.highlights.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {showAddButton && (
                                      <div className="d-flex gap-2">
                                        <button
                                          className={`btn btn-sm flex-grow-1 ${isCitySelected(city.id) ? 'btn-success' : 'btn-primary'}`}
                                          onClick={() => handleCitySelect(city)}
                                          disabled={isCitySelected(city.id)}
                                        >
                                          {isCitySelected(city.id) ? (
                                            <>
                                              <i className="fas fa-check me-1"></i>
                                              Added
                                            </>
                                          ) : (
                                            <>
                                              <i className="fas fa-plus me-1"></i>
                                              Add to Trip
                                            </>
                                          )}
                                        </button>
                                        <button className="btn btn-outline-primary btn-sm">
                                          <i className="fas fa-info-circle"></i>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                // List View Card
                                <div className="row g-0">
                                  <div className="col-md-3">
                                    <img
                                      src={city.image}
                                      className="img-fluid h-100"
                                      alt={city.name}
                                      style={{ objectFit: 'cover', minHeight: '150px' }}
                                    />
                                  </div>
                                  <div className="col-md-9">
                                    <div className="card-body p-3">
                                      <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                          <h5 className="card-title fw-bold">{city.name}, {city.country}</h5>
                                          <p className="text-muted mb-2">{city.description}</p>
                                        </div>
                                        <div className="text-end">
                                          <div className="text-success fw-bold">${city.averageCost}/day</div>
                                          <small className="text-muted">Cost Index: {city.costIndex}</small>
                                        </div>
                                      </div>

                                      <div className="d-flex flex-wrap gap-2 mb-3">
                                        <span className="badge bg-primary rounded-pill">{city.region}</span>
                                        <span className="badge bg-warning rounded-pill">
                                          <i className="fas fa-star me-1"></i>
                                          {city.popularity}% Popular
                                        </span>
                                        <span className="badge bg-info rounded-pill">
                                          <i className="fas fa-clock me-1"></i>
                                          {city.bestTime}
                                        </span>
                                      </div>

                                      <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-wrap gap-1">
                                          {city.highlights.map((highlight, idx) => (
                                            <span key={idx} className="badge bg-light text-dark rounded-pill small">
                                              {highlight}
                                            </span>
                                          ))}
                                        </div>
                                        {showAddButton && (
                                          <div className="d-flex gap-2">
                                            <button
                                              className={`btn btn-sm ${isCitySelected(city.id) ? 'btn-success' : 'btn-primary'}`}
                                              onClick={() => handleCitySelect(city)}
                                              disabled={isCitySelected(city.id)}
                                            >
                                              {isCitySelected(city.id) ? (
                                                <>
                                                  <i className="fas fa-check me-1"></i>
                                                  Added
                                                </>
                                              ) : (
                                                <>
                                                  <i className="fas fa-plus me-1"></i>
                                                  Add to Trip
                                                </>
                                              )}
                                            </button>
                                            <button className="btn btn-outline-primary btn-sm">
                                              <i className="fas fa-info-circle"></i>
                                            </button>
                                          </div>
                                        )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
