import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContractProvider } from './context/ContractContext';
import { PaymentProvider } from './context/PaymentContext';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { NETWORK } from './config/web3Config';
import { FarmerDashboard } from './components/dashboards/FarmerDashboard';
import { MiddlemanDashboard } from './components/dashboards/MiddlemanDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading FarmConnect...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'middleman':
        return <MiddlemanDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

function App() {
  return (
    <ThirdwebProvider
      activeChain={NETWORK}
      clientId={process.env.VITE_THIRDWEB_CLIENT_ID}
    >
      <Router>
        <AuthProvider>
          <ContractProvider>
            <PaymentProvider>
              <AppContent />
            </PaymentProvider>
          </ContractProvider>
        </AuthProvider>
      </Router>
    </ThirdwebProvider>
  );
}

export default App;