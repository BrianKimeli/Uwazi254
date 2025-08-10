// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { MessageSquare, Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react'; // Renamed User to UserIcon
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button'; // Custom button component
import { Link, useNavigate } from 'react-router-dom'; // For navigation after registration

const RegisterPage: React.FC = () => {
  const { register, error: authContextError } = useAuth(); // AuthContext provides register function and auth errors
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Form state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(''); // For form-specific validation errors

  // Handle form submission for registering a new user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(''); // Clear previous errors

    // Validate password confirmation
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // On success, redirect user to login page (or dashboard if auto-login implemented)
      navigate('/login');
    } catch (err: any) {
      // Display error returned from register function
      setLocalError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-lg">
            <MessageSquare className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Uwazi254</h1>
          <p className="text-blue-100">Join the Citizen Feedback & Transparency Platform</p>
        </div>

        {/* Registration Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h2>

          {/* Display form or auth errors */}
          {(localError || authContextError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {localError || authContextError}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name Input */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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

            {/* Password Input with visibility toggle */}
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

            {/* Confirm Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Link to Login Page */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
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

export default RegisterPage;