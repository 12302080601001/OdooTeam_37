import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VendorReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/vendors/${user.id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondToReview = async (reviewId, response) => {
    try {
      await axios.post(`/api/reviews/${reviewId}/respond`, { response });
      fetchReviews();
    } catch (error) {
      console.error('Error responding to review:', error);
    }
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filter === 'all') return true;
      if (filter === 'responded') return review.vendorResponse;
      if (filter === 'pending') return !review.vendorResponse;
      return review.rating === parseInt(filter);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length * 100).toFixed(1) : 0
  }));

  if (loading) {
    return <LoadingSpinner text="Loading reviews..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vendor-reviews"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Reviews & Ratings</h4>
          <p className="text-muted mb-0">Manage customer feedback and build your reputation</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline-primary">
            <i className="fas fa-download me-2"></i>
            Export Reviews
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-share me-2"></i>
            Share Reviews
          </button>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="row mb-4">
        <div className="col-lg-4 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-4 fw-bold text-warning mb-2">{averageRating}</div>
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={`fas fa-star ${star <= Math.round(averageRating) ? 'text-warning' : 'text-muted'}`}
                  ></i>
                ))}
              </div>
              <p className="text-muted mb-0">Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8 mb-3">
          <div className="card card-modern border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">Rating Distribution</h6>
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="d-flex align-items-center mb-2">
                  <div className="me-2" style={{ minWidth: '60px' }}>
                    <span className="fw-semibold">{rating} stars</span>
                  </div>
                  <div className="flex-grow-1 me-2">
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div style={{ minWidth: '40px' }}>
                    <small className="text-muted">{count}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-comments fa-2x"></i>
              </div>
              <h4 className="fw-bold">{reviews.length}</h4>
              <p className="text-muted mb-0">Total Reviews</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="fas fa-clock fa-2x"></i>
              </div>
              <h4 className="fw-bold">{reviews.filter(r => !r.vendorResponse).length}</h4>
              <p className="text-muted mb-0">Pending Response</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-reply fa-2x"></i>
              </div>
              <h4 className="fw-bold">{reviews.filter(r => r.vendorResponse).length}</h4>
              <p className="text-muted mb-0">Responded</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card card-modern border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-thumbs-up fa-2x"></i>
              </div>
              <h4 className="fw-bold">{reviews.filter(r => r.rating >= 4).length}</h4>
              <p className="text-muted mb-0">Positive Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="card card-modern mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="btn-group me-3" role="group">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All ({reviews.length})
                </button>
                <button
                  className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending ({reviews.filter(r => !r.vendorResponse).length})
                </button>
                <button
                  className={`btn ${filter === 'responded' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('responded')}
                >
                  Responded ({reviews.filter(r => r.vendorResponse).length})
                </button>
              </div>
              <div className="btn-group" role="group">
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    className={`btn ${filter === rating.toString() ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setFilter(rating.toString())}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onRespond={respondToReview}
            />
          ))
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-star fa-4x text-muted mb-3"></i>
            <h5 className="text-muted mb-3">No reviews found</h5>
            <p className="text-muted mb-4">
              {filter !== 'all' 
                ? 'No reviews match your current filter'
                : 'You haven\'t received any reviews yet'
              }
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ReviewCard = ({ review, onRespond }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');

  const handleSubmitResponse = (e) => {
    e.preventDefault();
    if (responseText.trim()) {
      onRespond(review.id, responseText);
      setResponseText('');
      setShowResponseForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-modern border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                 style={{ width: '40px', height: '40px' }}>
              <i className="fas fa-user text-white"></i>
            </div>
            <div>
              <h6 className="mb-0">{review.user?.firstName} {review.user?.lastName}</h6>
              <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
          <div className="text-end">
            <div className="mb-1">
              {[1, 2, 3, 4, 5].map(star => (
                <i
                  key={star}
                  className={`fas fa-star ${star <= review.rating ? 'text-warning' : 'text-muted'}`}
                ></i>
              ))}
            </div>
            <small className="text-muted">{review.service?.title}</small>
          </div>
        </div>

        <p className="mb-3">{review.comment}</p>

        {review.vendorResponse ? (
          <div className="bg-light rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-reply text-primary me-2"></i>
              <strong>Your Response:</strong>
            </div>
            <p className="mb-0">{review.vendorResponse}</p>
          </div>
        ) : (
          <div>
            {!showResponseForm ? (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowResponseForm(true)}
              >
                <i className="fas fa-reply me-2"></i>
                Respond to Review
              </button>
            ) : (
              <form onSubmit={handleSubmitResponse}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Write your response..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="btn-group">
                  <button type="submit" className="btn btn-primary btn-sm">
                    <i className="fas fa-paper-plane me-2"></i>
                    Send Response
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setShowResponseForm(false);
                      setResponseText('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VendorReviews;
