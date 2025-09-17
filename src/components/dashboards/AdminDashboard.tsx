import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, DollarSign, Package, AlertCircle, 
  CheckCircle, XCircle, Clock, Settings, Download, Filter
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Platform Revenue', value: '$127,450', change: '+18%', icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'Active Transactions', value: '1,234', change: '+23%', icon: Package, color: 'text-purple-600 bg-purple-100' },
    { label: 'System Health', value: '99.8%', change: '+0.1%', icon: CheckCircle, color: 'text-green-600 bg-green-100' }
  ];

  const platformData = [
    { name: 'Jan', revenue: 45000, users: 1200, transactions: 890 },
    { name: 'Feb', revenue: 52000, users: 1350, transactions: 1020 },
    { name: 'Mar', revenue: 48000, users: 1480, transactions: 950 },
    { name: 'Apr', revenue: 61000, users: 1620, transactions: 1180 },
    { name: 'May', revenue: 55000, users: 1750, transactions: 1050 },
    { name: 'Jun', revenue: 67000, users: 1890, transactions: 1290 }
  ];

  const userDistribution = [
    { name: 'Farmers', value: 45, color: '#22c55e' },
    { name: 'Middlemen', value: 30, color: '#3b82f6' },
    { name: 'Consumers', value: 25, color: '#f59e0b' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected on Node 3', time: '5 min ago', severity: 'medium' },
    { id: 2, type: 'error', message: 'Payment gateway timeout for transaction #TX001', time: '12 min ago', severity: 'high' },
    { id: 3, type: 'info', message: 'Scheduled maintenance completed successfully', time: '1 hour ago', severity: 'low' },
    { id: 4, type: 'success', message: 'New farmer verification batch processed', time: '2 hours ago', severity: 'low' }
  ];

  const recentTransactions = [
    { id: 'TX001', farmer: 'Sarah Johnson', middleman: 'Mike Chen', amount: 1250, product: 'Organic Tomatoes', status: 'completed', time: '10 min ago' },
    { id: 'TX002', farmer: 'David Park', middleman: 'Lisa Wong', amount: 890, product: 'Fresh Lettuce', status: 'pending', time: '25 min ago' },
    { id: 'TX003', farmer: 'Maria Garcia', middleman: 'John Smith', amount: 2100, product: 'Bell Peppers', status: 'completed', time: '1 hour ago' },
    { id: 'TX004', farmer: 'Ahmed Hassan', middleman: 'Emma Davis', amount: 750, product: 'Herbs Bundle', status: 'failed', time: '2 hours ago' }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      default: return Clock;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
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
                Admin Dashboard ⚙️
              </h1>
              <p className="text-gray-600">Monitor platform performance and manage system operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
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
          {/* Platform Analytics */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Platform Analytics</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="revenue">Revenue</option>
                  <option value="users">Users</option>
                  <option value="transactions">Transactions</option>
                </select>
                <div className="flex space-x-2">
                  {['7d', '30d', '90d'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {userDistribution.map((item, index) => (
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

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* System Alerts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {systemAlerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                return (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                      <AlertIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{transaction.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{transaction.product}</p>
                    <p className="text-xs text-gray-500">{transaction.farmer} → {transaction.middleman}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${transaction.amount}</p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Management</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'User Management', icon: Users },
              { label: 'System Settings', icon: Settings },
              { label: 'Data Analytics', icon: TrendingUp },
              { label: 'Export Reports', icon: Download }
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
    </div>
  );
};