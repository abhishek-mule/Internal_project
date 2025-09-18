import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
import { NETWORK } from './config/web3Config';
import ClaimPage from './pages/ClaimPage';
import NFTDropPage from './pages/NFTDropPage';

// Get the client ID from environment variables
const clientId = import.meta.env.VITE_APP_THIRDWEB_CLIENT_ID;

if (!clientId) {
  console.warn("Warning: VITE_APP_THIRDWEB_CLIENT_ID is not set in .env file");
}

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">AgroChain</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Claim NFT
                </Link>
                <Link to="/drop" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Create Drop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Routes>
          <Route path="/" element={<ClaimPage />} />
          <Route path="/drop" element={<NFTDropPage />} />
          <Route path="*" element={<ClaimPage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThirdwebProvider
      activeChain={NETWORK}
      clientId={clientId}
      supportedChains={[NETWORK]}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
      ]}
      autoConnect={true}
      dAppMeta={{
        name: "FarmConnect",
        description: "Decentralized Agricultural Supply Chain",
        logoUrl: "https://your-logo-url.png",
        url: window.location.origin,
      }}
      sdkOptions={{
        gasSettings: { maxPriceInGwei: 500 },
        readonlySettings: {
          chainId: NETWORK.chainId,
          rpcUrl: NETWORK.rpc[0],
        },
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </ThirdwebProvider>
  );
}

export default App;