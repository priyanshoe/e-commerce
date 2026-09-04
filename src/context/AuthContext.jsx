import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on first render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      const user = response.data;

      // Generate a beginner-friendly mock token
      const mockToken = `mock-token-${user.role.toLowerCase()}-${user.id}-${Date.now()}`;

      // Update state and localStorage
      setUser(user);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', mockToken);

      return { success: true, user: user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.error };
    }
  };

  // Register handler
  const register = async ({ name, email, password, role }) => {
    try {

      const response = await AuthService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: role || 'CUSTOMER',
      });

      const newUser = response.data;
      const mockToken = `mock-token-${newUser.role.toLowerCase()}-${newUser.id}-${Date.now()}`;

      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', mockToken);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.error };
    }
  };

  // Quick helper to switch demo accounts for instant learning & testing
  const switchDemoRole = async (targetRole) => {
    try {
      const response = await AuthService.findAll();
      const targetUser = response.data.find((u) => u.role === targetRole);
      if (targetUser) {
        const mockToken = `mock-token-${targetUser.role.toLowerCase()}-${targetUser.id}-${Date.now()}`;
        setUser(targetUser);
        setToken(mockToken);
        localStorage.setItem('user', JSON.stringify(targetUser));
        localStorage.setItem('token', mockToken);
        return targetUser;
      }
    } catch (e) {
      console.error('Failed to switch demo role:', e);
    }
    return null;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");

    return token && user ? true : false;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        switchDemoRole,
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
