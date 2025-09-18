import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { login, isLoading } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, selectedRole);
  };

  const handleDemoLogin = (role: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setSelectedRole(role);
    login(demoEmail, 'demo123', role);
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
          Welcome Back
        </h2>
        <p className="text-gray-600 text-lg">Sign in to your AgroChain account</p>
      </div>

      {/* Demo Login Buttons */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3 text-center">Quick Demo Access:</p>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleDemoLogin(role.id, `${role.id}@test.com`)}
              className={`p-2 rounded-lg border-2 text-xs font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow ${role.color} ${role.borderColor}`}
            >
              <div className="text-lg mb-1">{role.icon}</div>
              {role.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  selectedRole === role.id
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

        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 hover:shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 hover:shadow-sm"
              placeholder="Enter your password"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedRole}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </motion.div>
  );
};