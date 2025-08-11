import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return 'fas fa-crown';
      case 'planner':
        return 'fas fa-map-marked-alt';
      case 'vendor':
        return 'fas fa-store';
      default:
        return 'fas fa-user';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'planner':
        return 'bg-info';
      case 'vendor':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-modern sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <motion.i 
            className="fas fa-globe-americas fa-2x text-gradient me-2"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          ></motion.i>
          <span className="font-poppins fw-bold text-gradient">GlobeTrotter</span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/trips">
                <i className="fas fa-suitcase me-1"></i>
                My Trips
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/public-trips">
                <i className="fas fa-globe me-1"></i>
                Explore
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  <i className="fas fa-cog me-1"></i>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{ border: 'none' }}
              >
                <div className="d-flex align-items-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="rounded-circle me-2"
                      width="32"
                      height="32"
                    />
                  ) : (
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                         style={{ width: '32px', height: '32px' }}>
                      <i className={`${getRoleIcon(user?.role)} text-white`}></i>
                    </div>
                  )}
                  <div className="d-none d-md-block text-start">
                    <div className="fw-semibold">{user?.firstName} {user?.lastName}</div>
                    <small className={`badge ${getRoleBadgeColor(user?.role)}`}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </small>
                  </div>
                </div>
              </button>

              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="dropdown-menu dropdown-menu-end show"
                  style={{ position: 'absolute', right: 0, top: '100%' }}
                >
                  <div className="dropdown-header">
                    <div className="fw-bold">{user?.firstName} {user?.lastName}</div>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    className="dropdown-item" 
                    to="/profile"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <i className="fas fa-user me-2"></i>
                    Profile
                  </Link>
                  <Link 
                    className="dropdown-item" 
                    to="/settings"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </motion.div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
