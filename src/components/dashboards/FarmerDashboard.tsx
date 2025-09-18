import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Package, Star, Plus, 
  Sprout, Sun, Wallet, Eye, Edit3, Droplets
} from 'lucide-react';
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { AddCropModal } from './AddCropModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Crop } from '../../types';

export const FarmerDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  
  const address = useAddress();
  const connect = useMetamask();

  const handleConnectWallet = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, [connect]);

  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+18%', icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'Active Crops', value: '8', change: '+2', icon: Sprout, color: 'text-blue-600 bg-blue-100' },
    { label: 'Orders', value: '156', change: '+23%', icon: Package, color: 'text-purple-600 bg-purple-100' },
    { label: 'Rating', value: '4.9', change: '+0.2', icon: Star, color: 'text-yellow-600 bg-yellow-100' }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
    { name: 'Jul', revenue: 3490, expenses: 4300 }
  ];

  const cropDistribution = [
    { name: 'Tomatoes', value: 35, color: '#ef4444' },
    { name: 'Lettuce', value: 25, color: '#22c55e' },
    { name: 'Peppers', value: 20, color: '#f59e0b' },
    { name: 'Herbs', value: 20, color: '#8b5cf6' }
  ];

  const crops: Crop[] = [
    {
      id: '1',
      name: 'Cherry Tomatoes',
      variety: 'Organic',
      quantity: 1247,
      unit: 'lbs',
      pricePerUnit: 2.5,
      status: 'ready',
      plantedDate: '2024-03-15',
      expectedHarvest: '2024-06-15',
      progress: 95,
      health: 98,
      icon: '🍅'
    },
    {
      id: '2',
      name: 'Organic Lettuce',
      variety: 'Butterhead',
      quantity: 850,
      unit: 'heads',
      pricePerUnit: 1.8,
      status: 'growing',
      plantedDate: '2024-04-01',
      expectedHarvest: '2024-07-01',
      progress: 65,
      health: 92,
      icon: '🥬'
    },
    {
      id: '3',
      name: 'Bell Peppers',
      variety: 'Mixed Colors',
      quantity: 650,
      unit: 'lbs',
      pricePerUnit: 3.2,
      status: 'growing',
      plantedDate: '2024-04-10',
      expectedHarvest: '2024-07-20',
      progress: 45,
      health: 89,
      icon: '🫑'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'growing': return 'bg-yellow-100 text-yellow-800';
      case 'harvested': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Sarah! 🌱
              </h1>
              <p className="text-gray-600">Here's what's growing in your digital farm today</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
                  <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-green-800">Sunny, 78°F</span>
                </div>
                {!address ? (
                  <button
                    onClick={handleConnectWallet}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Connect Wallet</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAddCropModalOpen(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Crop</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
              <div className="flex space-x-2">
                {['7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Crop Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Crop Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {cropDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crops List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Crops</h2>
            <button className="text-green-600 hover:text-green-700 font-medium">View All</button>
          </div>
          
          <div className="grid gap-4">
            {crops.map((crop) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{crop.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                      <p className="text-sm text-gray-600">{crop.variety} • {crop.quantity} {crop.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(crop.quantity * crop.pricePerUnit).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">${crop.pricePerUnit}/{crop.unit}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                        {crop.status}
                      </span>
                      <div className="flex space-x-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Growth Progress</span>
                    <span className="font-medium">{crop.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                      style={{ width: `${crop.progress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Record Harvest', icon: Package },
              { label: 'Update Quality', icon: Star },
              { label: 'Check Weather', icon: Sun },
              { label: 'Schedule Irrigation', icon: Droplets }
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center space-y-2 p-4 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 text-white"
              >
                <action.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Add Crop Modal */}
      <AddCropModal
        isOpen={isAddCropModalOpen}
        onClose={() => setIsAddCropModalOpen(false)}
        onSuccess={(cropId) => {
          console.log('New crop added:', cropId);
          // Here you could refresh the crops list
        }}
      />
    </div>
  );
};