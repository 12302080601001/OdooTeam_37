import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

// Import vendor components
import VendorDashboardHome from '../vendor/VendorDashboardHome';
import VendorServices from '../vendor/VendorServices';
import VendorBookings from '../vendor/VendorBookings';
import VendorRevenue from '../vendor/VendorRevenue';
import VendorProfile from '../vendor/VendorProfile';
import VendorReviews from '../vendor/VendorReviews';
import VendorInventory from '../vendor/VendorInventory';
import VendorCommunication from '../vendor/VendorCommunication';
import VendorMarketing from '../vendor/VendorMarketing';
import VendorReports from '../vendor/VendorReports';

const VendorDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Navigation menu items
  const menuItems = [
    { 
      path: '/vendor', 
      icon: 'fas fa-tachometer-alt', 
      label: 'Dashboard',
      exact: true
    },
    { 
      path: '/vendor/services', 
      icon: 'fas fa-concierge-bell', 
      label: 'Services',
      submenu: [
        { path: '/vendor/services', label: 'All Services' },
        { path: '/vendor/services/create', label: 'Add Service' },
        { path: '/vendor/inventory', label: 'Inventory' }
      ]
    },
    { 
      path: '/vendor/bookings', 
      icon: 'fas fa-calendar-check', 
      label: 'Bookings' 
    },
    { 
      path: '/vendor/revenue', 
      icon: 'fas fa-chart-line', 
      label: 'Revenue' 
    },
    { 
      path: '/vendor/reviews', 
      icon: 'fas fa-star', 
      label: 'Reviews' 
    },
    { 
      path: '/vendor/communication', 
      icon: 'fas fa-comments', 
      label: 'Messages' 
    },
    { 
      path: '/vendor/marketing', 
      icon: 'fas fa-bullhorn', 
      label: 'Marketing' 
    },
    { 
      path: '/vendor/reports', 
      icon: 'fas fa-chart-bar', 
      label: 'Reports' 
    },
    { 
      path: '/vendor/profile', 
      icon: 'fas fa-user-cog', 
      label: 'Profile' 
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="vendor-dashboard">
      <div className="row g-0">
        {/* Vendor Sidebar */}
        <div className={`col-auto ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="vendor-sidebar bg-white shadow-sm border-end">
            <div className="sidebar-header p-3 border-bottom">
              <div className="d-flex align-items-center">
                <div className="vendor-avatar me-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                       style={{ width: '40px', height: '40px' }}>
                    <i className="fas fa-store text-white"></i>
                  </div>
                </div>
                {!sidebarCollapsed && (
                  <div className="vendor-info">
                    <h6 className="mb-0 fw-bold">{user?.firstName} {user?.lastName}</h6>
                    <small className="text-muted">Vendor Account</small>
                  </div>
                )}
                <button 
                  className="btn btn-sm btn-outline-secondary ms-auto"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <i className={`fas fa-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
                </button>
              </div>
            </div>

            <nav className="sidebar-nav">
              <ul className="nav flex-column p-2">
                {menuItems.map((item) => (
                  <li key={item.path} className="nav-item mb-1">
                    <Link
                      to={item.path}
                      className={`nav-link d-flex align-items-center px-3 py-2 rounded ${
                        isActiveRoute(item.path, item.exact) ? 'active bg-primary text-white' : 'text-dark'
                      }`}
                    >
                      <i className={`${item.icon} me-3`}></i>
                      {!sidebarCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {item.submenu && (
                            <i className="fas fa-chevron-down ms-auto"></i>
                          )}
                        </>
                      )}
                    </Link>
                    {item.submenu && !sidebarCollapsed && isActiveRoute(item.path) && (
                      <ul className="nav flex-column ms-4 mt-2">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.path} className="nav-item">
                            <Link
                              to={subItem.path}
                              className={`nav-link py-1 px-2 rounded ${
                                location.pathname === subItem.path ? 'active bg-light' : 'text-muted'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col">
          <div className="vendor-content">
            {/* Top Bar */}
            <div className="top-bar bg-white border-bottom p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="page-title">
                  <h4 className="mb-0 fw-bold">
                    {location.pathname === '/vendor' ? 'Dashboard' :
                     location.pathname.includes('/services') ? 'Services' :
                     location.pathname.includes('/bookings') ? 'Bookings' :
                     location.pathname.includes('/revenue') ? 'Revenue Analytics' :
                     location.pathname.includes('/reviews') ? 'Reviews & Ratings' :
                     location.pathname.includes('/communication') ? 'Communication' :
                     location.pathname.includes('/marketing') ? 'Marketing Tools' :
                     location.pathname.includes('/reports') ? 'Reports & Insights' :
                     location.pathname.includes('/profile') ? 'Profile Settings' :
                     location.pathname.includes('/inventory') ? 'Inventory Management' :
                     'Vendor Dashboard'}
                  </h4>
                </div>
                <div className="top-actions">
                  <div className="btn-group">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-bell me-1"></i>
                      Notifications
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <i className="fas fa-plus me-1"></i>
                      Quick Add
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <i className="fas fa-headset me-1"></i>
                      Support
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Routes */}
            <div className="content-area px-3">
              <Routes>
                <Route index element={<VendorDashboardHome />} />
                <Route path="services/*" element={<VendorServices />} />
                <Route path="bookings/*" element={<VendorBookings />} />
                <Route path="revenue/*" element={<VendorRevenue />} />
                <Route path="reviews/*" element={<VendorReviews />} />
                <Route path="communication/*" element={<VendorCommunication />} />
                <Route path="marketing/*" element={<VendorMarketing />} />
                <Route path="reports/*" element={<VendorReports />} />
                <Route path="profile/*" element={<VendorProfile />} />
                <Route path="inventory/*" element={<VendorInventory />} />
                <Route path="*" element={<Navigate to="/vendor" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vendor-sidebar {
          min-height: 100vh;
          width: 280px;
          transition: all 0.3s ease;
        }
        
        .sidebar-collapsed .vendor-sidebar {
          width: 80px;
        }
        
        .nav-link.active {
          background-color: var(--bs-primary) !important;
          color: white !important;
        }
        
        .nav-link:hover {
          background-color: var(--bs-light);
          color: var(--bs-primary);
        }
        
        .top-bar {
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.95) !important;
        }
        
        .content-area {
          min-height: calc(100vh - 80px);
        }
        
        .vendor-avatar {
          transition: all 0.3s ease;
        }
        
        .sidebar-collapsed .vendor-info {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VendorDashboard;
