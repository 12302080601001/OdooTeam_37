import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = {
    traveller: [
      { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { path: '/trips', icon: 'fas fa-suitcase', label: 'My Trips' },
      { path: '/trips/create', icon: 'fas fa-plus', label: 'Plan New Trip' },
      { path: '/public-trips', icon: 'fas fa-globe', label: 'Explore Trips' },
      { path: '/profile', icon: 'fas fa-user', label: 'Profile' }
    ],
    admin: [
      { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { path: '/admin/users', icon: 'fas fa-users', label: 'User Management' },
      { path: '/admin/trips', icon: 'fas fa-suitcase', label: 'Trip Moderation' },
      { path: '/admin/analytics', icon: 'fas fa-chart-bar', label: 'Analytics' },
      { path: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' }
    ],
    planner: [
      { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { path: '/planner/trips', icon: 'fas fa-map-marked-alt', label: 'My Public Trips' },
      { path: '/planner/create', icon: 'fas fa-plus', label: 'Create Itinerary' },
      { path: '/planner/analytics', icon: 'fas fa-chart-line', label: 'Engagement' },
      { path: '/profile', icon: 'fas fa-user', label: 'Profile' }
    ],
    vendor: [
      { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { path: '/vendor/services', icon: 'fas fa-store', label: 'My Services' },
      { path: '/vendor/bookings', icon: 'fas fa-calendar-check', label: 'Bookings' },
      { path: '/vendor/revenue', icon: 'fas fa-dollar-sign', label: 'Revenue' },
      { path: '/profile', icon: 'fas fa-user', label: 'Profile' }
    ]
  };

  const currentMenuItems = menuItems[user?.role] || menuItems.traveller;

  return (
    <div className="sidebar-modern d-none d-md-block">
      <div className="p-4">
        <div className="text-center mb-4">
          <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
               style={{ width: '60px', height: '60px' }}>
            <i className="fas fa-user fa-2x text-white"></i>
          </div>
          <h6 className="text-white mb-1">{user?.firstName} {user?.lastName}</h6>
          <small className="text-white-50">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </small>
        </div>

        <nav className="nav flex-column">
          {currentMenuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`sidebar-item text-decoration-none text-white d-flex align-items-center ${
                  isActive(item.path) ? 'active' : ''
                }`}
              >
                <i className={`${item.icon} me-3`}></i>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-5 p-3 bg-white bg-opacity-10 rounded">
          <h6 className="text-white mb-3">
            <i className="fas fa-chart-pie me-2"></i>
            Quick Stats
          </h6>
          <div className="row text-center">
            <div className="col-6">
              <div className="text-white">
                <div className="h5 mb-0">12</div>
                <small>Trips</small>
              </div>
            </div>
            <div className="col-6">
              <div className="text-white">
                <div className="h5 mb-0">5</div>
                <small>Countries</small>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 p-3 bg-white bg-opacity-10 rounded">
          <h6 className="text-white mb-2">
            <i className="fas fa-question-circle me-2"></i>
            Need Help?
          </h6>
          <p className="text-white-50 small mb-2">
            Check our help center for guides and tutorials.
          </p>
          <button className="btn btn-outline-light btn-sm">
            <i className="fas fa-external-link-alt me-1"></i>
            Help Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
