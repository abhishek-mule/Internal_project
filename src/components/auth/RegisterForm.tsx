import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, MapPin, Eye, EyeOff, Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();

  const roles = [
    { 
      id: 'farmer',
      name: 'Farmer',
      icon: '🌱',
      color: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      activeColor: 'ring-emerald-500',
      description: 'For agricultural producers'
    },
    { 
      id: 'middleman',
      name: 'Middleman',
      icon: '🚛',
      color: 'bg-gradient-to-br from-blue-50 to-sky-100',
      borderColor: 'border-sky-200',
      activeColor: 'ring-sky-500',
      description: 'For distributors and traders'
    },
    { 
      id: 'admin',
      name: 'Admin',
      icon: '⚙️',
      color: 'bg-gradient-to-br from-purple-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      activeColor: 'ring-indigo-500',
      description: 'For platform administrators'
    }
  ];

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role as 'farmer' | 'middleman' | 'admin',
        location: formData.location
      });

      if (!success) {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-lg">
            <Sprout className="w-10 h-10 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
          Join AgroChain
        </h2>
        <p className="text-gray-600 text-lg">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-800 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm" role="alert">
            {error}
          </div>
        )}
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a *
          </label>
          <div className="grid grid-cols-3 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleInputChange('role', role.id)}
                className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  formData.role === role.id
                    ? `${role.color} ${role.borderColor} ring-2 ${role.activeColor} shadow-lg scale-105`
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{role.icon}</div>
                <div className="font-semibold mb-1">{role.name}</div>
                <div className="text-xs text-gray-500">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your location"
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 hover:shadow-sm"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 hover:shadow-sm"
                placeholder="Confirm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.role}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
};