import React from 'react';
import { NFTDropManager } from '@/components/nft/NFTDropManager';

const NFTDropPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create & Manage NFT Drops</h1>
          <p className="text-xl text-gray-600">Easily create and manage your NFT collections</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <NFTDropManager />
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "1. Connect Wallet",
                description: "Connect your Web3 wallet to the Polygon network."
              },
              {
                title: "2. Upload Your NFTs",
                description: "Use our simple form or CSV upload to create your NFT collection."
              },
              {
                title: "3. Mint & Distribute",
                description: "Mint your NFTs and distribute them to your community."
              }
            ].map((step, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDropPage;
