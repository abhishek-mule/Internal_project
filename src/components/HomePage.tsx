import React from 'react';
import { Sprout, Heart, Shield, Globe } from 'lucide-react';

interface HomePageProps {
  setActiveView: (view: 'customer' | 'farmer') => void;
}

export function HomePage({ setActiveView }: HomePageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Complete Transparency',
      description: 'Track every step from seed to plate with blockchain-verified authenticity',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Heart,
      title: 'Trust & Quality',
      description: 'Connect directly with farmers and know the story behind your food',
      color: 'text-red-500 bg-red-100'
    },
    {
      icon: Globe,
      title: 'Sustainable Impact',
      description: 'Support eco-friendly farming practices and reduce food waste',
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Sprout className="h-20 w-20 text-green-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              From <span className="text-green-600">Farm</span> to{' '}
              <span className="text-blue-600">Fork</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the magical journey of your food with complete transparency. 
              Every scan tells a story, every bite connects you to the earth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setActiveView('customer')}
                className="group px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-blue-700"
              >
                <span className="flex items-center space-x-2">
                  <span>Scan & Discover</span>
                  <div className="w-5 h-5 bg-white bg-opacity-30 rounded group-hover:rotate-12 transition-transform duration-300"></div>
                </span>
              </button>
              
              <button
                onClick={() => setActiveView('farmer')}
                className="group px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-green-700"
              >
                <span className="flex items-center space-x-2">
                  <Sprout className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Farmer Portal</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-green-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-200 rounded-full opacity-40 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-float"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FarmConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just a platform - we're your trusted companion in the wonderful world of agriculture
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of conscious consumers and dedicated farmers building a more transparent food system
          </p>
          <button
            onClick={() => setActiveView('customer')}
            className="px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Start Exploring Now
          </button>
        </div>
      </div>
    </div>
  );
}