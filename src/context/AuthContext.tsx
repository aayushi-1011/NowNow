import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('userDetails') !== null;
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userDetails = {
        name: 'Demo User',
        email,
        phone: '',
        address: ''
      };
      
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      setIsAuthenticated(true);
      setError(null);

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('userDetailsUpdated'));
      
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const loginWithGoogle = async () => {
    try {
      await new Promise((resolve, reject) => {
        gapi.load('auth2', () => {
          gapi.auth2
            .init({
              client_id: '69829932706-06uhm5t3ruhbb9429ebkbtmnu595v0eq.apps.googleusercontent.com',
              scope: 'profile email',
            })
            .then(resolve)
            .catch(reject);
        });
      });

      const authInstance = gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn();
      const profile = googleUser.getBasicProfile();
      
      const userDetails = {
        name: profile.getName(),
        email: profile.getEmail(),
        phone: '',
        address: ''
      };

      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      setIsAuthenticated(true);
      setError(null);

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('userDetailsUpdated'));
      
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Google');
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const userDetails = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: ''
      };
      
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      setIsAuthenticated(true);
      setError(null);

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('userDetailsUpdated'));
      
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    }
  };

  const logout = () => {
    localStorage.removeItem('userDetails');
    localStorage.removeItem('orders');
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('userDetails') !== null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login,
      loginWithGoogle,
      signup, 
      logout, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};