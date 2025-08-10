// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';

import { auth } from '../firebase';
import { User } from '../types';

interface UserData extends User {
  uid: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getFriendlyFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-up is disabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. It must be at least 6 characters.';
    case 'auth/invalid-credential':
      return 'Authentication failed due to invalid credentials.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Define demo accounts here
const demoAccounts = [
  {
    email: 'john@citizen.com',
    password: 'password',
    userData: {
      id: 'demo-john-id',
      uid: 'demo-john-id',
      name: 'John Demo',
      email: 'john@citizen.com',
      phone: '',
      role: 'citizen',
      county: '',
      constituency: '',
      ward: '',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
  },
  {
    email: 'admin@homabay.gov.ke',
    password: 'password',
    userData: {
      id: 'demo-admin-id',
      uid: 'demo-admin-id',
      name: 'Admin Demo',
      email: 'admin@homabay.gov.ke',
      phone: '',
      role: 'admin',
      county: '',
      constituency: '',
      ward: '',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
  },
];

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          phone: '',
          role: 'citizen',
          county: '',
          constituency: '',
          ward: '',
          createdAt: firebaseUser.metadata.creationTime
            ? new Date(firebaseUser.metadata.creationTime).toISOString()
            : new Date().toISOString(),
          emailVerified: firebaseUser.emailVerified,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    // Check if credentials match a demo account and bypass Firebase auth
    const demoAccount = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );
    if (demoAccount) {
      setUser(demoAccount.userData);
      setLoading(false);
      console.log('Logged in with demo account:', demoAccount.userData.email);
      return;
    }

    // Otherwise, proceed with Firebase auth
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in.');
    } catch (e: any) {
      console.error(e);
      const message = getFriendlyFirebaseErrorMessage(e.code);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });
      await sendEmailVerification(firebaseUser);
      console.log('User registered, profile updated, verification email sent.');
    } catch (e: any) {
      console.error(e);
      const message = getFriendlyFirebaseErrorMessage(e.code);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null); // clear user on logout
      console.log('User logged out.');
    } catch (e: any) {
      const message = `Logout failed: ${e.message}`;
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
