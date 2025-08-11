import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const SessionManager = () => {
  const { token, refreshToken, logout, isTokenExpired } = useAuth();
  const refreshIntervalRef = useRef(null);
  const warningShownRef = useRef(false);

  useEffect(() => {
    if (!token) {
      // Clear any existing intervals if no token
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    // Check token expiration every 5 minutes
    const checkTokenExpiration = () => {
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;

        // If token expires in less than 10 minutes, try to refresh
        if (timeUntilExpiry < 600 && timeUntilExpiry > 0) {
          console.log('Token expires soon, attempting refresh...');
          refreshToken().then(result => {
            if (!result.success) {
              console.error('Failed to refresh token:', result.error);
              if (!warningShownRef.current) {
                toast.warning('Your session will expire soon. Please save your work and login again.');
                warningShownRef.current = true;
              }
            } else {
              warningShownRef.current = false;
            }
          });
        }

        // If token is already expired, logout
        if (timeUntilExpiry <= 0) {
          console.log('Token has expired, logging out...');
          logout(false);
          toast.error('Your session has expired. Please login again.');
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    };

    // Initial check
    checkTokenExpiration();

    // Set up interval to check every 5 minutes
    refreshIntervalRef.current = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    // Cleanup on unmount or token change
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [token, refreshToken, logout]);

  // Handle page visibility change to refresh token when user returns
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && token) {
        // User returned to the page, check if token needs refresh
        if (isTokenExpired(token)) {
          console.log('Token expired while away, attempting refresh...');
          refreshToken().then(result => {
            if (!result.success) {
              logout(false);
              toast.error('Your session has expired. Please login again.');
            }
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, refreshToken, logout, isTokenExpired]);

  // Handle browser storage events (for multi-tab logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && e.newValue === null) {
        // Token was removed in another tab, logout this tab too
        logout(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);

  return null; // This component doesn't render anything
};

export default SessionManager;
