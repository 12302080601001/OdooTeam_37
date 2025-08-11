import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole, requiredRoles }) => {
  const { user, loading, isAuthenticated, canAccess } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && !canAccess(requiredRole)) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card card-modern text-center">
              <div className="card-body p-5">
                <i className="fas fa-lock fa-3x text-warning mb-3"></i>
                <h3>Access Denied</h3>
                <p className="text-muted">
                  You don't have permission to access this page.
                </p>
                <p className="text-muted">
                  Required role: <strong>{requiredRole}</strong><br />
                  Your role: <strong>{user?.role}</strong>
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (requiredRoles && !canAccess(requiredRoles)) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card card-modern text-center">
              <div className="card-body p-5">
                <i className="fas fa-lock fa-3x text-warning mb-3"></i>
                <h3>Access Denied</h3>
                <p className="text-muted">
                  You don't have permission to access this page.
                </p>
                <p className="text-muted">
                  Required roles: <strong>{requiredRoles.join(', ')}</strong><br />
                  Your role: <strong>{user?.role}</strong>
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
