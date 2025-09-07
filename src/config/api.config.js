// API Configuration with fallbacks

const getApiBaseUrl = () => {
    // Get the environment variable
    let apiUrl = import.meta.env.VITE_API_BASE_URL;
    
    // Log the raw environment variable for debugging (only in development)
    if (import.meta.env.DEV) {
        console.log('Raw VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
        console.log('All env vars:', import.meta.env);
    }
    
    // If not set or incorrectly set, use appropriate defaults
    if (!apiUrl || apiUrl === 'undefined' || apiUrl === 'null' || apiUrl === '') {
        // Check if we're in development or production
        const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
        
        if (isDevelopment) {
            apiUrl = 'http://localhost:5000/api/v1';
        } else {
            // Production fallback
            apiUrl = 'https://jobhunt-server-six.vercel.app/api/v1';
        }
        
        console.warn('VITE_API_BASE_URL not set or invalid, using fallback:', apiUrl);
    }
    
    // Ensure the URL is properly formatted
    // Remove any accidental double slashes except after protocol
    apiUrl = apiUrl.replace(/([^:]\/)\/+/g, '$1');
    
    // Ensure it starts with http:// or https://
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        // If it's just a domain, add https://
        if (apiUrl.includes('.')) {
            apiUrl = 'https://' + apiUrl;
        } else {
            // Likely a malformed URL
            console.error('Invalid API URL format:', apiUrl);
            apiUrl = 'https://jobhunt-server-six.vercel.app/api/v1';
        }
    }
    
    // Remove trailing slash if present
    apiUrl = apiUrl.replace(/\/$/, '');
    
    return apiUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Log the configuration (useful for debugging)
if (import.meta.env.DEV) {
    console.log('API Configuration:', {
        baseUrl: API_BASE_URL,
        environment: import.meta.env.MODE,
        isDevelopment: import.meta.env.DEV
    });
}

export default {
    API_BASE_URL,
    buildApiUrl
};
