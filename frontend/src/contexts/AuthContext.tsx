import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Omollo',
    email: 'john@citizen.com',
    phone: '+254 712 345 678',
    role: 'citizen',
    county: 'Kiambu',
    constituency: 'Ruiru',
    ward: 'Kahawa West',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Lydia Achieng',
    email: 'admin@homabay.gov.ke',
    phone: '+254 720 123 456',
    role: 'admin',
    county: 'Kiambu',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    email: 'moderator@uwazi254.com',
    phone: '+254 733 987 654',
    role: 'moderator',
    county: 'Nairobi',
    createdAt: '2024-01-12'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('uwazi254_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('uwazi254_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uwazi254_user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};