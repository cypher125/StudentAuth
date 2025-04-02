// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_FAILED_KEY = 'auth_failed';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://student-auth-api.onrender.com/api';
//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Get the current access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
};

/**
 * Get the current refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
};

/**
 * Check if the current token is about to expire (within 5 minutes)
 */
export const isTokenExpiringSoon = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return true; // If no expiry time, assume it's expiring
  
  const expiryDate = new Date(parseInt(expiryTime, 10));
  const now = new Date();
  
  // Token is expiring if it's within 5 minutes of expiry
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  return expiryDate <= fiveMinutesFromNow;
};

/**
 * Decode JWT token to get expiry time
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

/**
 * Store tokens in localStorage
 */
export const storeTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  // Set token expiry time based on JWT expiry
  const decodedToken = decodeToken(accessToken);
  if (decodedToken && decodedToken.exp) {
    const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    console.log('Token will expire at:', new Date(expiryTime).toLocaleString());
  }
  
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  // Clear any auth failed flag since we have new tokens
  clearAuthFailed();
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_FAILED_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Set the auth failed flag to indicate auth failure
 */
export const setAuthFailed = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(AUTH_FAILED_KEY, 'true');
};

/**
 * Check if auth has failed
 */
export const hasAuthFailed = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return localStorage.getItem(AUTH_FAILED_KEY) === 'true';
};

/**
 * Clear the auth failed flag
 */
export const clearAuthFailed = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_FAILED_KEY);
};

/**
 * Refresh the access token using the refresh token
 * Returns the new access token if successful, null otherwise
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.log('No refresh token available');
    return null;
  }
  
  try {
    console.log('Attempting to refresh token...');
    // Use the correct endpoint for token refresh
    const response = await fetch(`${API_URL}/users/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to refresh token:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('Error details:', errorData);
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    console.log('Token refresh successful');
    
    // Store the new tokens
    if (data.access) {
      storeTokens(data.access, refreshToken); // Keep the same refresh token
      return data.access;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    
    // Only clear tokens if it's not a network error
    if (!(error instanceof TypeError)) {
      clearTokens();
    }
    
    return null;
  }
};

/**
 * Proactively refresh token if it's about to expire
 */
export const ensureFreshToken = async (): Promise<string | null> => {
  const token = getAccessToken();
  if (!token) return null;
  
  // If token is about to expire, refresh it
  if (isTokenExpiringSoon()) {
    console.log('Token is expiring soon, refreshing...');
    return await refreshAccessToken();
  }
  
  return token;
};

/**
 * Setup automatic token refresh
 * This should be called once when the app initializes
 */
export const setupTokenRefresh = (onRefreshFailed: () => void): (() => void) => {
  // Function to check if token refresh is needed and handle it
  const checkAndRefreshToken = async () => {
    const token = getAccessToken();
    if (!token) return;
    
    // Check if token is expiring soon or if auth has failed
    if (isTokenExpiringSoon() || hasAuthFailed()) {
      console.log('Token needs refresh - expiring soon or auth failed');
      clearAuthFailed();
      
      // Try to refresh the token
      const newToken = await refreshAccessToken();
      
      // If refresh failed, call the callback
      if (!newToken) {
        console.error('Token refresh failed, calling onRefreshFailed');
        onRefreshFailed();
      }
    }
  };
  
  // Check immediately
  checkAndRefreshToken();
  
  // Set up periodic checking (every 1 minute)
  const intervalId = setInterval(checkAndRefreshToken, 60000);
  
  // Set up refresh on window focus
  const handleFocus = () => {
    console.log('Window focused, checking token status');
    checkAndRefreshToken();
  };
  
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleFocus);
  }
  
  // Return a cleanup function
  return () => {
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleFocus);
    }
  };
};

/**
 * Add authorization header to fetch options
 */
export const addAuthHeader = (options: RequestInit = {}): RequestInit => {
  const token = getAccessToken();
  
  if (!token) return options;
  
  return {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };
}; 