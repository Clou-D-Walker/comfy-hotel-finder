
import axios from 'axios';
import { mockServices } from './mockData';

// Create an axios instance with the base URL
const API_URL = 'http://localhost:8000/api';

// Flag to determine if we should use mock data
let useMockData = false;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add a request interceptor to add the authorization token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.code === 'ERR_NETWORK') {
    console.error('Network error: Cannot connect to the backend server');
    // Set mock mode to true when we can't connect to the backend
    useMockData = true;
    return { 
      error: true,
      message: 'Cannot connect to the server. Using mock data instead.',
      useMockData: true
    };
  }
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return { 
      error: true,
      message: error.response.data?.message || 'Server error',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    // Set mock mode to true
    useMockData = true;
    return { 
      error: true,
      message: 'No response from server. Using mock data instead.',
      useMockData: true
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { 
      error: true,
      message: error.message || 'An unknown error occurred',
    };
  }
};

// Function to set mock mode
export const setMockMode = (mode) => {
  useMockData = mode;
  localStorage.setItem('useMockData', mode.toString());
  return useMockData;
};

// Check if mock mode is enabled in localStorage
export const initMockMode = () => {
  const mockMode = localStorage.getItem('useMockData');
  if (mockMode === 'true') {
    useMockData = true;
  }
  return useMockData;
};

// Initialize mock mode
initMockMode();

// Authentication with redirect to homepage on logout
export const authAPI = {
  login: async (email, password) => {
    try {
      if (useMockData) {
        // Mock successful login
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        return {
          user: {
            _id: 'user123',
            username: 'mockuser',
            email: email,
            country: 'USA',
            city: 'New York',
            phone: '+1234567890',
            isAdmin: email.includes('admin'),
            isModerator: email.includes('mod'),
            isWorker: email.includes('worker')
          },
          token
        };
      }
      
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  register: async (userData) => {
    try {
      if (useMockData) {
        // Mock successful registration
        return {
          user: {
            _id: 'user123',
            username: userData.username,
            email: userData.email,
            country: userData.country,
            city: userData.city,
            isAdmin: false,
            isModerator: false,
            isWorker: false
          },
          message: 'Registration successful!'
        };
      }
      
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    // Redirect to homepage when logging out
    window.location.href = '/';
  },
  getCurrentUser: async () => {
    try {
      if (useMockData) {
        // Mock current user
        return {
          _id: 'user123',
          username: 'mockuser',
          email: 'user@example.com',
          country: 'USA',
          city: 'New York',
          phone: '+1234567890',
          isAdmin: false,
          isModerator: false,
          isWorker: false
        };
      }
      
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Check if the backend is available
export const checkBackendConnection = async () => {
  try {
    await api.get('/health-check', { timeout: 3000 });
    // If successful, set mock mode to false
    setMockMode(false);
    return true;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    // If failed, set mock mode to true
    setMockMode(true);
    return false;
  }
};

// Export full hotel API
export const hotelAPI = {
  getAllHotels: async () => {
    try {
      if (useMockData) {
        // Return mock data
        return [
          {
            _id: 'hotel1',
            name: 'Luxury Resort',
            description: 'Beautiful resort with ocean views',
            city: 'Miami',
            address: '123 Beach Dr',
            distance: '2km from city center',
            photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
            rating: 4.8,
            price: 250,
            featured: true
          },
          {
            _id: 'hotel2',
            name: 'Downtown Suites',
            description: 'Modern suites in the heart of downtown',
            city: 'New York',
            address: '456 City Ave',
            distance: '0.5km from city center',
            photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
            rating: 4.5,
            price: 180,
            featured: true
          },
          {
            _id: 'hotel3',
            name: 'Mountain View Lodge',
            description: 'Cozy lodge with stunning mountain views',
            city: 'Denver',
            address: '789 Mountain Rd',
            distance: '5km from city center',
            photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
            rating: 4.7,
            price: 200,
            featured: false
          }
        ];
      }
      
      const response = await api.get('/hotels');
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      if (apiError.useMockData) {
        // Return mock data if we're in mock mode due to an error
        return [
          {
            _id: 'hotel1',
            name: 'Luxury Resort',
            description: 'Beautiful resort with ocean views',
            city: 'Miami',
            address: '123 Beach Dr',
            distance: '2km from city center',
            photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
            rating: 4.8,
            price: 250,
            featured: true
          },
          {
            _id: 'hotel2',
            name: 'Downtown Suites',
            description: 'Modern suites in the heart of downtown',
            city: 'New York',
            address: '456 City Ave',
            distance: '0.5km from city center',
            photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
            rating: 4.5,
            price: 180,
            featured: true
          },
          {
            _id: 'hotel3',
            name: 'Mountain View Lodge',
            description: 'Cozy lodge with stunning mountain views',
            city: 'Denver',
            address: '789 Mountain Rd',
            distance: '5km from city center',
            photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
            rating: 4.7,
            price: 200,
            featured: false
          }
        ];
      }
      throw apiError;
    }
  },
  getHotelById: async (id) => {
    try {
      if (useMockData) {
        // Return mock data for a specific hotel
        const hotels = [
          {
            _id: 'hotel1',
            name: 'Luxury Resort',
            description: 'Beautiful resort with ocean views',
            city: 'Miami',
            address: '123 Beach Dr',
            distance: '2km from city center',
            photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
            rating: 4.8,
            price: 250,
            featured: true
          },
          {
            _id: 'hotel2',
            name: 'Downtown Suites',
            description: 'Modern suites in the heart of downtown',
            city: 'New York',
            address: '456 City Ave',
            distance: '0.5km from city center',
            photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
            rating: 4.5,
            price: 180,
            featured: true
          }
        ];
        
        return hotels.find(hotel => hotel._id === id) || hotels[0];
      }
      
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Add basic mock services if mockData.js is not available
export const mockServices = {
  getUserBookings: async () => {
    return [
      {
        _id: 'booking1',
        hotel: {
          _id: 'hotel1',
          name: 'Luxury Resort',
          photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945']
        },
        room: {
          _id: 'room1',
          name: 'Deluxe Suite',
        },
        dateStart: new Date('2023-07-10'),
        dateEnd: new Date('2023-07-15'),
        price: 1250,
        status: 'confirmed'
      },
      {
        _id: 'booking2',
        hotel: {
          _id: 'hotel2',
          name: 'Downtown Suites',
          photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa']
        },
        room: {
          _id: 'room2',
          name: 'Executive Room',
        },
        dateStart: new Date('2023-08-20'),
        dateEnd: new Date('2023-08-25'),
        price: 900,
        status: 'pending'
      }
    ];
  },
  cancelBooking: async (id) => {
    return {
      _id: id,
      status: 'cancelled',
      cancellationDate: new Date()
    };
  }
};

export default api;
