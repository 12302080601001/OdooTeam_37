import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('business');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-profile"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Vendor Profile</h4>
          <p className="text-muted mb-0">Manage your business information and settings</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline-primary">
            <i className="fas fa-eye me-2"></i>
            Preview Profile
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-save me-2"></i>
            Save Changes
          </button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="card card-modern border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'business' ? 'active' : ''}`}
                onClick={() => setActiveTab('business')}
              >
                <i className="fas fa-building me-2"></i>
                Business Info
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                <i className="fas fa-address-book me-2"></i>
                Contact Details
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'verification' ? 'active' : ''}`}
                onClick={() => setActiveTab('verification')}
              >
                <i className="fas fa-shield-alt me-2"></i>
                Verification
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog me-2"></i>
                Settings
              </button>
            </li>
          </ul>
        </div>
        
        <div className="card-body">
          {activeTab === 'business' && <BusinessInfoTab profile={profile} />}
          {activeTab === 'contact' && <ContactDetailsTab profile={profile} />}
          {activeTab === 'verification' && <VerificationTab profile={profile} />}
          {activeTab === 'settings' && <SettingsTab profile={profile} />}
        </div>
      </div>
    </motion.div>
  );
};

const BusinessInfoTab = ({ profile }) => (
  <div className="business-info">
    <div className="row">
      <div className="col-md-8">
        <div className="mb-3">
          <label className="form-label">Business Name *</label>
          <input
            type="text"
            className="form-control"
            defaultValue={profile?.businessName || ''}
            placeholder="Enter your business name"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Business Description</label>
          <textarea
            className="form-control"
            rows="4"
            defaultValue={profile?.description || ''}
            placeholder="Describe your business and services"
          ></textarea>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Business Type</label>
            <select className="form-select" defaultValue={profile?.businessType || ''}>
              <option value="">Select business type</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="tour_operator">Tour Operator</option>
              <option value="transport">Transport Service</option>
              <option value="activity_provider">Activity Provider</option>
              <option value="guide">Tour Guide</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Years in Business</label>
            <input
              type="number"
              className="form-control"
              defaultValue={profile?.yearsInBusiness || ''}
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Business Address</label>
          <input
            type="text"
            className="form-control"
            defaultValue={profile?.address || ''}
            placeholder="Enter your business address"
          />
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              defaultValue={profile?.city || ''}
              placeholder="City"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Country</label>
            <select className="form-select" defaultValue={profile?.country || ''}>
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
              {/* Add more countries */}
            </select>
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="text-center">
          <div className="mb-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-center mx-auto" 
                 style={{ width: '150px', height: '150px' }}>
              <i className="fas fa-camera fa-2x text-muted"></i>
            </div>
          </div>
          <button className="btn btn-outline-primary mb-3">
            <i className="fas fa-upload me-2"></i>
            Upload Logo
          </button>
          <p className="text-muted small">
            Recommended size: 300x300px<br/>
            Max file size: 5MB
          </p>
        </div>
        
        <div className="mt-4">
          <h6>Business Hours</h6>
          <div className="small">
            <div className="d-flex justify-content-between mb-1">
              <span>Monday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Tuesday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Wednesday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Thursday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Friday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Saturday:</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Sunday:</span>
              <span>Closed</span>
            </div>
          </div>
          <button className="btn btn-outline-secondary btn-sm mt-2">
            <i className="fas fa-edit me-1"></i>
            Edit Hours
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ContactDetailsTab = ({ profile }) => (
  <div className="contact-details">
    <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Primary Phone *</label>
          <input
            type="tel"
            className="form-control"
            defaultValue={profile?.phone || ''}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Secondary Phone</label>
          <input
            type="tel"
            className="form-control"
            defaultValue={profile?.secondaryPhone || ''}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Business Email *</label>
          <input
            type="email"
            className="form-control"
            defaultValue={profile?.businessEmail || ''}
            placeholder="business@example.com"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Website</label>
          <input
            type="url"
            className="form-control"
            defaultValue={profile?.website || ''}
            placeholder="https://www.example.com"
          />
        </div>
      </div>
      
      <div className="col-md-6">
        <h6 className="mb-3">Social Media</h6>
        
        <div className="mb-3">
          <label className="form-label">Facebook</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fab fa-facebook text-primary"></i>
            </span>
            <input
              type="url"
              className="form-control"
              defaultValue={profile?.socialMedia?.facebook || ''}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Instagram</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fab fa-instagram text-danger"></i>
            </span>
            <input
              type="url"
              className="form-control"
              defaultValue={profile?.socialMedia?.instagram || ''}
              placeholder="https://instagram.com/yourpage"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Twitter</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fab fa-twitter text-info"></i>
            </span>
            <input
              type="url"
              className="form-control"
              defaultValue={profile?.socialMedia?.twitter || ''}
              placeholder="https://twitter.com/yourpage"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">LinkedIn</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fab fa-linkedin text-primary"></i>
            </span>
            <input
              type="url"
              className="form-control"
              defaultValue={profile?.socialMedia?.linkedin || ''}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VerificationTab = ({ profile }) => (
  <div className="verification">
    <div className="alert alert-info">
      <i className="fas fa-info-circle me-2"></i>
      Verification helps build trust with customers and improves your visibility in search results.
    </div>
    
    <div className="row">
      <div className="col-md-6">
        <div className="card border-0 bg-light mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Business License</h6>
                <small className="text-muted">Upload your business registration</small>
              </div>
              <div>
                {profile?.verifications?.businessLicense ? (
                  <span className="badge bg-success">Verified</span>
                ) : (
                  <span className="badge bg-warning">Pending</span>
                )}
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm mt-2">
              <i className="fas fa-upload me-1"></i>
              Upload Document
            </button>
          </div>
        </div>
        
        <div className="card border-0 bg-light mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Tax ID</h6>
                <small className="text-muted">Verify your tax identification</small>
              </div>
              <div>
                {profile?.verifications?.taxId ? (
                  <span className="badge bg-success">Verified</span>
                ) : (
                  <span className="badge bg-secondary">Not Submitted</span>
                )}
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm mt-2">
              <i className="fas fa-upload me-1"></i>
              Upload Document
            </button>
          </div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="card border-0 bg-light mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Insurance Certificate</h6>
                <small className="text-muted">Liability insurance documentation</small>
              </div>
              <div>
                {profile?.verifications?.insurance ? (
                  <span className="badge bg-success">Verified</span>
                ) : (
                  <span className="badge bg-secondary">Not Submitted</span>
                )}
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm mt-2">
              <i className="fas fa-upload me-1"></i>
              Upload Document
            </button>
          </div>
        </div>
        
        <div className="card border-0 bg-light mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Professional Certifications</h6>
                <small className="text-muted">Industry certifications and awards</small>
              </div>
              <div>
                <span className="badge bg-secondary">Optional</span>
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm mt-2">
              <i className="fas fa-upload me-1"></i>
              Upload Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsTab = ({ profile }) => (
  <div className="settings">
    <div className="row">
      <div className="col-md-6">
        <h6 className="mb-3">Notification Preferences</h6>
        
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="emailBookings" defaultChecked />
          <label className="form-check-label" htmlFor="emailBookings">
            Email notifications for new bookings
          </label>
        </div>
        
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="emailReviews" defaultChecked />
          <label className="form-check-label" htmlFor="emailReviews">
            Email notifications for new reviews
          </label>
        </div>
        
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="emailMessages" defaultChecked />
          <label className="form-check-label" htmlFor="emailMessages">
            Email notifications for messages
          </label>
        </div>
        
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="smsBookings" />
          <label className="form-check-label" htmlFor="smsBookings">
            SMS notifications for urgent bookings
          </label>
        </div>
      </div>
      
      <div className="col-md-6">
        <h6 className="mb-3">Business Settings</h6>
        
        <div className="mb-3">
          <label className="form-label">Default Currency</label>
          <select className="form-select" defaultValue={profile?.currency || 'USD'}>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Time Zone</label>
          <select className="form-select" defaultValue={profile?.timezone || ''}>
            <option value="">Select timezone</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
          </select>
        </div>
        
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="instantBooking" />
          <label className="form-check-label" htmlFor="instantBooking">
            Enable instant booking for services
          </label>
        </div>
        
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="autoConfirm" />
          <label className="form-check-label" htmlFor="autoConfirm">
            Auto-confirm bookings during business hours
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default VendorProfile;
