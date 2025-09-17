import React from 'react';
import { Sprout, TrendingUp, DollarSign, Users, Star, Package, Droplets, Sun } from 'lucide-react';

export function FarmerDashboard() {
  const harvestStats = [
    { label: 'Tomatoes Ready', value: 1247, unit: 'lbs', growth: '+12%', icon: Package, color: 'text-red-500 bg-red-100' },
    { label: 'Total Revenue', value: 3240, unit: '$', growth: '+18%', icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'Happy Customers', value: 156, unit: '', growth: '+23%', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Quality Rating', value: 4.9, unit: '/5', growth: '+0.2', icon: Star, color: 'text-yellow-600 bg-yellow-100' }
  ];

  const crops = [
    { name: 'Cherry Tomatoes', progress: 85, stage: 'Ripening', health: 95, icon: '🍅', nextHarvest: '3 days' },
    { name: 'Organic Lettuce', progress: 60, stage: 'Growing', health: 88, icon: '🥬', nextHarvest: '12 days' },
    { name: 'Bell Peppers', progress: 40, stage: 'Flowering', health: 92, icon: '🫑', nextHarvest: '18 days' },
    { name: 'Basil Herbs', progress: 75, stage: 'Ready', health: 97, icon: '🌿', nextHarvest: 'Now!' }
  ];

  const recentActivity = [
    { action: 'Harvest completed', item: 'Cherry Tomatoes', time: '2 hours ago', icon: Package, color: 'text-green-600' },
    { action: 'Quality check passed', item: 'Organic Lettuce', time: '4 hours ago', icon: Star, color: 'text-yellow-600' },
    { action: 'New order received', item: 'Bell Peppers', time: '6 hours ago', icon: Users, color: 'text-blue-600' },
    { action: 'Irrigation completed', item: 'Basil Herbs', time: '8 hours ago', icon: Droplets, color: 'text-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-6 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, Sarah! 🌱
                </h1>
                <p className="text-lg text-gray-600">
                  Your garden is thriving today. Here's what's growing in your digital farm.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
                    <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-green-800">Sunny, 78°F</span>
                  </div>
                  <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
                    <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Soil: 45% moisture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Garden of Earnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {harvestStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{stat.growth}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {typeof stat.value === 'number' && stat.value > 100 
                    ? stat.value.toLocaleString() 
                    : stat.value}
                  <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Crop Progress - Growing Garden */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Sprout className="w-7 h-7 text-green-600 mr-3" />
                Growing Garden
              </h2>
            </div>
            
            <div className="space-y-4">
              {crops.map((crop, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{crop.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                        <p className="text-sm text-gray-600">{crop.stage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Next harvest: {crop.nextHarvest}</p>
                      <p className="text-xs text-gray-500">Health: {crop.health}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Growth Progress</span>
                      <span className="font-medium">{crop.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          crop.progress > 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          crop.progress > 50 ? 'bg-gradient-to-r from-yellow-400 to-green-500' :
                          'bg-gradient-to-r from-orange-400 to-yellow-500'
                        }`}
                        style={{ width: `${crop.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-7 h-7 text-blue-600 mr-3" />
              Recent Activity
            </h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  <div className={`p-2 rounded-lg ${activity.color.includes('green') ? 'bg-green-100' : 
                    activity.color.includes('yellow') ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Record Harvest', icon: Package, action: 'harvest' },
              { label: 'Update Quality', icon: Star, action: 'quality' },
              { label: 'Check Orders', icon: Users, action: 'orders' },
              { label: 'Schedule Irrigation', icon: Droplets, action: 'irrigation' }
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center space-y-2 p-4 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 text-white"
              >
                <action.icon className="w-8 h-8" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}