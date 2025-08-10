// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { MessageSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button'; // Custom button component
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, error: authContextError } = useAuth(); // AuthContext provides login function and any auth errors

  // State for form inputs and UI feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(''); // For errors specific to this form

  // Predefined demo accounts for quick testing/demo purposes
  const demoAccounts = [
    { email: 'john@citizen.com', password: 'password', role: 'Citizen' },
    { email: 'admin@homabay.gov.ke', password: 'password', role: 'Admin' },
  ];

  // Handles form submission to attempt login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(''); // Clear any previous errors

    try {
      await login(email, password);
      // On successful login, AuthContext will handle user state update and navigation
    } catch (err: any) {
      // Show error message from login attempt
      setLocalError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Logo and App Title */}
        <div className="text-center mb-8">
          <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-lg">
            <MessageSquare className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Uwazi254</h1>
          <p className="text-blue-100">Citizen Feedback & Transparency Platform</p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Welcome Back
          </h2>

          {/* Display error messages from local form or AuthContext */}
          {(localError || authContextError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {localError || authContextError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password Input with toggle visibility */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Link to registration page */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Accounts for quick-fill */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4 text-center">Demo Accounts:</p>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.role}</p>
                    <p className="text-xs text-gray-600">{account.email}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">Click to use</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100">
          <p className="text-sm">
            Made with ❤️ for Kenya • Innovate 254 Hackathon
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
