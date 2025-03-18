
import axios from 'axios';
import { Hotel, Room, User, Booking, SearchCriteria } from '@/types';

// Create an axios instance with the base URL
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Authentication
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  register: async (userData: Partial<User>) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Hotels
export const hotelAPI = {
  getAllHotels: async () => {
    const response = await api.get('/hotels');
    return response.data;
  },
  getHotelById: async (id: string) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },
  searchHotels: async (criteria: SearchCriteria) => {
    const response = await api.post('/hotels/search', criteria);
    return response.data;
  },
  getFeaturedHotels: async () => {
    const response = await api.get('/hotels/featured');
    return response.data;
  },
  createHotel: async (hotelData: Partial<Hotel>) => {
    const response = await api.post('/hotels', hotelData);
    return response.data;
  },
  updateHotel: async (id: string, hotelData: Partial<Hotel>) => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },
  deleteHotel: async (id: string) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },
};

// Rooms
export const roomAPI = {
  getRoomsForHotel: async (hotelId: string) => {
    const response = await api.get(`/rooms/hotel/${hotelId}`);
    return response.data;
  },
  getRoomById: async (id: string) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
  createRoom: async (hotelId: string, roomData: Partial<Room>) => {
    const response = await api.post(`/rooms/${hotelId}`, roomData);
    return response.data;
  },
  updateRoom: async (id: string, roomData: Partial<Room>) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },
  deleteRoom: async (id: string, hotelId: string) => {
    const response = await api.delete(`/rooms/${id}/${hotelId}`);
    return response.data;
  },
  checkRoomAvailability: async (roomId: string, dateStart: Date, dateEnd: Date) => {
    const response = await api.get(`/rooms/availability/${roomId}`, {
      params: { dateStart, dateEnd },
    });
    return response.data;
  },
};

// Bookings
export const bookingAPI = {
  getUserBookings: async (userId: string) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
  createBooking: async (bookingData: Partial<Booking>) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  cancelBooking: async (id: string) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
  getAllBookings: async (hotelId?: string) => {
    const url = hotelId ? `/bookings/hotel/${hotelId}` : '/bookings';
    const response = await api.get(url);
    return response.data;
  },
};

// Users
export const userAPI = {
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export default api;
