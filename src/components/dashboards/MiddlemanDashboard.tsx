import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, Package, MapPin, Clock, AlertTriangle, CheckCircle, 
  TrendingUp, DollarSign, Users, Star, Filter, Search, Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Shipment } from '../../types';

export const MiddlemanDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Active Shipments', value: '24', change: '+12%', icon: Truck, color: 'text-blue-600 bg-blue-100' },
    { label: 'Total Revenue', value: '$45,230', change: '+18%', icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'Delivery Rate', value: '98.5%', change: '+2.1%', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { label: 'Avg Rating', value: '4.8', change: '+0.3', icon: Star, color: 'text-yellow-600 bg-yellow-100' }
  ];

  const deliveryData = [
    { name: 'Mon', delivered: 12, pending: 3 },
    { name: 'Tue', delivered: 15, pending: 2 },
    { name: 'Wed', delivered: 18, pending: 4 },
    { name: 'Thu', delivered: 14, pending: 1 },
    { name: 'Fri', delivered: 20, pending: 5 },
    { name: 'Sat', delivered: 16, pending: 2 },
    { name: 'Sun', delivered: 10, pending: 1 }
  ];

  const shipments: Shipment[] = [
    {
      id: 'SH001',
      orderId: 'ORD-2024-001',
      from: 'Green Valley Farm',
      to: 'Fresh Market Downtown',
      product: 'Organic Tomatoes',
      quantity: '500 lbs',
      status: 'in-transit',
      estimatedDelivery: '2024-06-15 14:30',
      currentLocation: 'Highway 101, Mile 45',
      progress: 65
    },
    {
      id: 'SH002',
      orderId: 'ORD-2024-002',
      from: 'Sunny Acres Farm',
      to: 'Organic Grocery Co.',
      product: 'Mixed Vegetables',
      quantity: '300 lbs',
      status: 'pending',
      estimatedDelivery: '2024-06-16 10:00',
      currentLocation: 'Warehouse A',
      progress: 0
    },
    {
      id: 'SH003',
      orderId: 'ORD-2024-003',
      from: 'Mountain View Farm',
      to: 'City Farmers Market',
      product: 'Fresh Herbs',
      quantity: '150 lbs',
      status: 'delivered',
      estimatedDelivery: '2024-06-14 16:00',
      currentLocation: 'Delivered',
      progress: 100
    },
    {
      id: 'SH004',
      orderId: 'ORD-2024-004',
      from: 'Valley Fresh Farm',
      to: 'Premium Grocers',
      product: 'Bell Peppers',
      quantity: '400 lbs',
      status: 'delayed',
      estimatedDelivery: '2024-06-15 12:00',
      currentLocation: 'Traffic Delay - Route 5',
      progress: 45
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in-transit': return Truck;
      case 'pending': return Clock;
      case 'delayed': return AlertTriangle;
      default: return Package;
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesFilter = selectedFilter === 'all' || shipment.status === selectedFilter;
    const matchesSearch = shipment.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.to.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Logistics Hub 🚛
              </h1>
              <p className="text-gray-600">Manage your shipments and track deliveries in real-time</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
                <Truck className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">24 Active Routes</span>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                New Shipment
              </button>
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
          {/* Delivery Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Delivery Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delivered" fill="#22c55e" name="Delivered" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Live Map Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Live Tracking</h2>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500">Real-time vehicle tracking</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Vehicles</span>
                <span className="font-medium text-blue-600">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">On Schedule</span>
                <span className="font-medium text-green-600">10</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delayed</span>
                <span className="font-medium text-red-600">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipments List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Shipment Management</h2>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredShipments.map((shipment) => {
              const StatusIcon = getStatusIcon(shipment.status);
              return (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(shipment.status).replace('text-', 'bg-').replace('800', '100')}`}>
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(shipment.status).split(' ')[1]}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{shipment.id}</h3>
                        <p className="text-sm text-gray-600">{shipment.product} • {shipment.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Route</p>
                      <p className="font-medium text-gray-900">{shipment.from} → {shipment.to}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                      <p className="font-medium text-gray-900">{new Date(shipment.estimatedDelivery).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Current Location</span>
                      <span className="font-medium">{shipment.progress}% Complete</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{shipment.currentLocation}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          shipment.status === 'delivered' ? 'bg-green-500' :
                          shipment.status === 'delayed' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${shipment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Pending Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { task: 'Update delivery status for SH001', priority: 'High', icon: AlertTriangle },
              { task: 'Schedule pickup for new order', priority: 'Medium', icon: Clock },
              { task: 'Review driver performance', priority: 'Low', icon: Users }
            ].map((task, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 text-white"
              >
                <task.icon className="w-5 h-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <p className="text-xs opacity-75">{task.priority} Priority</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};