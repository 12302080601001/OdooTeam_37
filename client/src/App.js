import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SessionManager from './components/auth/SessionManager';
import './styles/vendor.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import TravellerDashboard from './components/dashboards/TravellerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import PlannerDashboard from './components/dashboards/PlannerDashboard';
import VendorDashboard from './components/dashboards/VendorDashboard';

// Trip Components
import TripList from './components/trips/TripList';
import TripDetail from './components/trips/TripDetail';
import TripCreate from './components/trips/TripCreate';
import TripEdit from './components/trips/TripEdit';

// Activity Components
import ActivityList from './components/activities/ActivityList';
import ActivityCreate from './components/activities/ActivityCreate';

// Profile Components
import Profile from './components/profile/Profile';

// Public Components
import LandingPage from './components/public/LandingPage';
import PublicTrips from './components/public/PublicTrips';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Public routes (no authentication required)
  if (!isAuthenticated()) {
    return (
      <div className="App">
        <SessionManager />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public-trips" element={<PublicTrips />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  }

  // Authenticated routes
  return (
    <div className="App">
      <SessionManager />
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 p-0">
            <Sidebar />
          </div>
          <div className="col-md-9 col-lg-10">
            <main className="p-4">
              <Routes>
                {/* Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      {user?.role === 'admin' && <AdminDashboard />}
                      {user?.role === 'traveller' && <TravellerDashboard />}
                      {user?.role === 'planner' && <PlannerDashboard />}
                      {user?.role === 'vendor' && <VendorDashboard />}
                    </ProtectedRoute>
                  }
                />

                {/* Trip Routes */}
                <Route
                  path="/trips"
                  element={
                    <ProtectedRoute>
                      <TripList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/create"
                  element={
                    <ProtectedRoute>
                      <TripCreate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:id"
                  element={
                    <ProtectedRoute>
                      <TripDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:id/edit"
                  element={
                    <ProtectedRoute>
                      <TripEdit />
                    </ProtectedRoute>
                  }
                />

                {/* Activity Routes */}
                <Route
                  path="/trips/:tripId/activities"
                  element={
                    <ProtectedRoute>
                      <ActivityList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:tripId/activities/create"
                  element={
                    <ProtectedRoute>
                      <ActivityCreate />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Vendor Routes */}
                <Route
                  path="/vendor/*"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Planner Routes */}
                <Route
                  path="/planner/*"
                  element={
                    <ProtectedRoute requiredRole="planner">
                      <PlannerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Profile Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Public Routes (accessible when authenticated) */}
                <Route path="/public-trips" element={<PublicTrips />} />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
