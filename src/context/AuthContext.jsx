
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, checkBackendConnection } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

// Define action types
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  backendAvailable: null,
};

// Create context
const AuthContext = createContext({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'BACKEND_STATUS':
      return {
        ...state,
        backendAvailable: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check backend connection status
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkBackendConnection();
      dispatch({ type: 'BACKEND_STATUS', payload: isConnected });
      
      if (!isConnected) {
        toast({
          title: "Connection Error",
          description: "Cannot connect to the backend server. Please ensure it is running at http://localhost:8000",
          variant: "destructive",
          duration: 6000
        });
      }
    };
    
    checkConnection();
    // Check connection periodically
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Check if user is logged in when the app loads
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        dispatch({ type: 'LOGIN_START' });
        const user = await authAPI.getCurrentUser();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: error.message || 'Session expired. Please log in again.' 
        });
      }
    };

    if (state.backendAvailable) {
      verifyUser();
    }
  }, [state.backendAvailable]);

  // Login function
  const login = async (email, password) => {
    if (!state.backendAvailable) {
      toast({
        title: "Connection Error",
        description: "Cannot connect to the backend server. Please ensure it is running.",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authAPI.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.message || 'Failed to login' 
      });
      toast({
        title: "Login Failed",
        description: error.message || 'Failed to login',
        variant: "destructive"
      });
    }
  };

  // Register function
  const register = async (userData) => {
    if (!state.backendAvailable) {
      toast({
        title: "Connection Error",
        description: "Cannot connect to the backend server. Please ensure it is running at http://localhost:8000",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'REGISTER_START' });
    try {
      const data = await authAPI.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: data.user });
      toast({
        title: "Success",
        description: "Registered successfully",
      });
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error.message || 'Failed to register' 
      });
      toast({
        title: "Registration Failed",
        description: error.message || 'Failed to register',
        variant: "destructive"
      });
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    // Redirect is handled by the authAPI.logout() function
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
