import React from 'react';
import { Sprout, Users, QrCode } from 'lucide-react';

interface HeaderProps {
  activeView: 'home' | 'customer' | 'farmer';
  setActiveView: (view: 'home' | 'customer' | 'farmer') => void;
}

export function Header({ activeView, setActiveView }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b-2 border-green-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">FarmConnect</span>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'home'
                  ? 'bg-green-100 text-green-800 shadow-md'
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveView('customer')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeView === 'customer'
                  ? 'bg-blue-100 text-blue-800 shadow-md'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>Customer Journey</span>
            </button>
            <button
              onClick={() => setActiveView('farmer')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeView === 'farmer'
                  ? 'bg-green-100 text-green-800 shadow-md'
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Farmer Dashboard</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}