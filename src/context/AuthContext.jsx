import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage on first render
  useEffect(() => {
    authUser();
  }, []);

  // token authentication
  const authUser = async () => {
    try {
      const token = localStorage.getItem("token");
      // No token -> don't call /auth/me
      if (!token) {
        setUser(null);
        return;
      }
      const response = await AuthService.authMe();
      if (response.success) {
        setUser(response.data);
        // save user to localstorage if needed
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to authenticate user:', error.data.message);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }

  // Login handler
  const login = async (email, password) => {
    try {
      const data = {
        email, password
      }
      const response = await AuthService.login(data)
      const token = response.data?.data?.token;
      const authUser = response.data?.data?.user

      // Update state and localStorage
      setUser(authUser);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(authUser));
      localStorage.setItem('token', token);

      return { success: true, user: authUser };
    } catch (error) {
      console.error('Login error:', error.error);
      return { success: false, message: error.error };
    }
  };

  // Register handler
  const register = async ({ name, email, password, role }) => {
    try {
      const data = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: role || 'CUSTOMER',
      }
      const response = await AuthService.register(data);

      const token = response.data?.data?.token;
      const newUser = response.data?.data?.user

      // Update state and localStorage
      setUser(newUser);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.error };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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

export default AuthContext;
