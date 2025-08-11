import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    dateOfBirth: '',
    gender: '',
    travelPreferences: {
      budgetRange: '',
      preferredDestinations: [],
      travelStyle: '',
      accommodationType: '',
      transportMode: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      tripReminders: true,
      budgetAlerts: true,
      communityUpdates: false
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        travelPreferences: user.travelPreferences || prev.travelPreferences,
        notifications: user.notifications || prev.notifications
      }));
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`/api/users/${user.id}`, profileData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await axios.put(`/api/users/${user.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!user) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  return (
    <div className="container-fluid">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="row"
      >
        {/* Profile Header */}
        <div className="col-12 mb-4">
          <motion.div variants={itemVariants} className="card card-modern">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2 text-center">
                  <div className="profile-avatar mb-3 mb-md-0">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=120&background=667eea&color=fff`}
                      alt={user.name}
                      className="rounded-circle"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-camera me-1"></i>
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-10">
                  <h2 className="mb-1">{user.name}</h2>
                  <p className="text-muted mb-2">{user.email}</p>
                  <p className="mb-3">{profileData.bio || 'Travel enthusiast exploring the world one destination at a time.'}</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-primary-soft text-primary">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {profileData.location || 'Location not set'}
                    </span>
                    <span className="badge bg-success-soft text-success">
                      <i className="fas fa-calendar me-1"></i>
                      Member since {new Date(user.createdAt).getFullYear()}
                    </span>
                    <span className="badge bg-info-soft text-info">
                      <i className="fas fa-suitcase me-1"></i>
                      {user.totalTrips || 0} trips planned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Tabs */}
        <div className="col-12">
          <motion.div variants={itemVariants} className="card card-modern">
            <div className="card-header bg-transparent border-0">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="fas fa-user me-2"></i>
                    Personal Info
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preferences')}
                  >
                    <i className="fas fa-cog me-2"></i>
                    Travel Preferences
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <i className="fas fa-bell me-2"></i>
                    Notifications
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <i className="fas fa-shield-alt me-2"></i>
                    Security
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {/* Personal Info Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        value={profileData.gender}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself and your travel experiences..."
                      />
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Travel Preferences Tab */}
              {activeTab === 'preferences' && (
                <form onSubmit={handleProfileUpdate}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Budget Range (per trip)</label>
                      <select
                        className="form-select"
                        value={profileData.travelPreferences.budgetRange}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          travelPreferences: {
                            ...profileData.travelPreferences,
                            budgetRange: e.target.value
                          }
                        })}
                      >
                        <option value="">Select Budget Range</option>
                        <option value="budget">Budget ($0 - $1,000)</option>
                        <option value="mid-range">Mid-range ($1,000 - $5,000)</option>
                        <option value="luxury">Luxury ($5,000+)</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Travel Style</label>
                      <select
                        className="form-select"
                        value={profileData.travelPreferences.travelStyle}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          travelPreferences: {
                            ...profileData.travelPreferences,
                            travelStyle: e.target.value
                          }
                        })}
                      >
                        <option value="">Select Travel Style</option>
                        <option value="adventure">Adventure</option>
                        <option value="relaxation">Relaxation</option>
                        <option value="cultural">Cultural</option>
                        <option value="business">Business</option>
                        <option value="family">Family</option>
                        <option value="solo">Solo</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      <i className="fas fa-save me-2"></i>
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordChange}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-warning" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-key me-2"></i>
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                    <div className="col-md-6">
                      <div className="alert alert-info">
                        <h6><i className="fas fa-info-circle me-2"></i>Password Requirements</h6>
                        <ul className="mb-0 small">
                          <li>At least 6 characters long</li>
                          <li>Mix of letters and numbers recommended</li>
                          <li>Avoid using personal information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
