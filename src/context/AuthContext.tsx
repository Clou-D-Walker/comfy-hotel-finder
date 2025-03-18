
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

// Define action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'UPDATE_USER'; payload: User };

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

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
          payload: 'Session expired. Please log in again.' 
        });
      }
    };

    verifyUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authAPI.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
      toast.success('Logged in successfully');
    } catch (error: any) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || 'Failed to login' 
      });
      toast.error(error.response?.data?.message || 'Failed to login');
    }
  };

  // Register function
  const register = async (userData: Partial<User>) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const data = await authAPI.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: data.user });
      toast.success('Registered successfully');
    } catch (error: any) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error.response?.data?.message || 'Failed to register' 
      });
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
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
